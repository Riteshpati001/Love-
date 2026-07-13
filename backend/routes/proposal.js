const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal'); 

// Import your S3 and Cloudinary configurations for media cleanup
const { deleteVoiceFromS3 } = require('../config/s3');
const { cloudinary } = require('../config/cloudinary');

// GET: Retrieve all proposals
router.get('/', async (req, res, next) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: proposals.length,
      data: proposals
    });
  } catch (error) {
    next(error);
  }
});

// POST: Create a new proposal
router.post('/', async (req, res, next) => {
  try {
    const newProposal = await Proposal.create(req.body);
    res.status(201).json({
      success: true,
      data: newProposal
    });
  } catch (error) {
    next(error);
  }
});

// GET: Retrieve a single proposal by ID
router.get('/:id', async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// NEW ROUTE - DELETE: Remove proposal & media
// ==========================================
router.delete('/:id', async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // 1. Clean up any attached S3 / Cloudinary media files before deleting the record
    if (proposal.media && proposal.media.length > 0) {
      for (const item of proposal.media) {
        try {
          if (item.fileType === 'audio') {
            // Remove from S3
            await deleteVoiceFromS3(item.publicId);
          } else {
            // Remove from Cloudinary (image or video)
            let resourceType = 'image';
            if (item.fileType === 'video') resourceType = 'video';
            await cloudinary.uploader.destroy(item.publicId, { resource_type: resourceType });
          }
        } catch (mediaError) {
          // Log media cleanup errors but don't stop the database deletion
          console.error(`Error deleting media file ${item.publicId}:`, mediaError.message);
        }
      }
    }

    // 2. Delete the proposal document from MongoDB
    await Proposal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Proposal and associated media deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// NEW ROUTE - POST: Add uploaded media details (metadata) to an existing proposal
// ==========================================
router.post('/:id/media', async (req, res, next) => {
  try {
    // 1. Helper logs to trace incoming payloads in your Render Console
    console.log("=== INCOMING MEDIA REQUEST ===");
    console.log("Proposal ID:", req.params.id);
    console.log("Content-Type Header:", req.headers['content-type']);
    console.log("Request Body:", req.body);
    console.log("===============================");

    // 2. Extract values flexibly from camelCase or Cloudinary's default snake_case responses
    const url = req.body.url || req.body.secure_url;
    const publicId = req.body.publicId || req.body.public_id;
    const fileType = req.body.fileType || req.body.file_type || req.body.resource_type;

    // 3. Validation fallback with debug context
    if (!url || !publicId || !fileType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. The backend expects url (or secure_url), publicId (or public_id), and fileType (or resource_type).',
        receivedBody: req.body
      });
    }

    // 4. Locate target proposal
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // 5. Append new media metadata to the array
    proposal.media.push({
      url,
      publicId,
      fileType,
      uploadedAt: new Date()
    });

    // 6. Persist changes in MongoDB
    await proposal.save();

    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// NEW ROUTE - DELETE: Remove an individual media item from a proposal & S3/Cloudinary
// ==========================================
router.delete('/:id/media/:mediaId', async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found'
      });
    }

    // Find the specific media item inside the proposal's media sub-document array
    const mediaItem = proposal.media.id(req.params.mediaId);

    if (!mediaItem) {
      return res.status(404).json({
        success: false,
        message: 'Media item not found'
      });
    }

    // Clean up the storage resource from the cloud
    try {
      if (mediaItem.fileType === 'audio') {
        await deleteVoiceFromS3(mediaItem.publicId);
      } else {
        let resourceType = 'image';
        if (mediaItem.fileType === 'video') resourceType = 'video';
        await cloudinary.uploader.destroy(mediaItem.publicId, { resource_type: resourceType });
      }
    } catch (mediaError) {
      console.error(`Storage deletion failed for ${mediaItem.publicId}:`, mediaError.message);
    }

    // Remove from MongoDB array
    proposal.media.pull(req.params.mediaId);
    await proposal.save();

    res.status(200).json({
      success: true,
      data: proposal,
      media: proposal.media // Return updated media list to keep frontend in sync
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
