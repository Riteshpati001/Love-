const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal'); // Adjust path to your model if needed

// Import S3 and Cloudinary configs for media cleanup upon deletion
const { deleteVoiceFromS3 } = require('../config/s3');
const { cloudinary } = require('../config/cloudinary');

// --- 1. GET ROUTE HANDLER (Fetch all proposals) ---
const getProposals = async (req, res) => {
  try {
    // Fetch proposals from the database, sorting them by newest first
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    
    // Send them back as JSON.
    res.status(200).json({
      success: true,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// --- 2. POST ROUTE HANDLER (Create a proposal) ---
const createProposal = async (req, res) => {
  try {
    const { 
      receiverEmail, 
      receiverName, 
      introMessage, 
      proposalMessage, 
      galleryPassword, 
      musicUrl,
      sender 
    } = req.body;

    const newProposal = new Proposal({
      sender: sender || req.user?.email || "Anonymous", 
      receiverEmail,
      receiverName,
      introMessage,
      proposalMessage,
      galleryPassword,
      musicUrl
    });

    await newProposal.save();

    res.status(201).json({ 
      success: true, 
      message: "Proposal created successfully", 
      data: newProposal 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// --- 3. DELETE ROUTE HANDLER (Delete a proposal and its media) ---
const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the proposal first to inspect its media for deletion
    const proposal = await Proposal.findById(id);
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: "Proposal not found" });
    }

    // Clean up S3 and Cloudinary files to avoid leaving orphaned media
    if (proposal.media && proposal.media.length > 0) {
      for (const item of proposal.media) {
        try {
          if (item.fileType === 'audio') {
            await deleteVoiceFromS3(item.publicId);
          } else {
            let resourceType = 'image';
            if (item.fileType === 'video') resourceType = 'video';
            await cloudinary.uploader.destroy(item.publicId, { resource_type: resourceType });
          }
        } catch (mediaError) {
          console.error(`Failed to delete media asset ${item.publicId}:`, mediaError.message);
          // Safe catch: Don't let a media cleanup failure block database deletion
        }
      }
    }

    // Delete the proposal document from MongoDB
    await Proposal.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true, 
      message: "Proposal and associated media deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// --- ROUTE DEFINITIONS ---

// GET /api/proposals - Handles fetching proposals
router.get('/', getProposals);

// POST /api/proposals - Handles creating proposals
router.post('/', createProposal);

// DELETE /api/proposals/:id - Handles deleting a proposal (Fixes the new 404 error)
router.delete('/:id', deleteProposal);

// --- EXPORT THE ROUTER ---
module.exports = router;
