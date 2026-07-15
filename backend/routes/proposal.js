const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal'); // Adjust path to your model if needed

// Your API route logic for handling POST /api/proposals
const createProposal = async (req, res) => {
  try {
    // 1. Destructure the new fields exactly as they are sent from the frontend payload
    const { 
      receiverEmail, 
      receiverName, 
      introMessage, 
      proposalMessage, 
      galleryPassword, 
      musicUrl,
      sender // Usually passed from authenticated user, or frontend if included
    } = req.body;

    // 2. Create the proposal using the new schema structure
    const newProposal = new Proposal({
      sender: sender || req.user?.email || "Anonymous", // Fallback if sender is handled differently
      receiverEmail,
      receiverName,
      introMessage,
      proposalMessage,
      galleryPassword,
      musicUrl
    });

    // 3. Save to database
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

// --- ROUTE DEFINITIONS ---

// This maps to: POST /api/proposals/
router.post('/', createProposal);

// If you need to add more routes later (like fetching a proposal), you can define them here:
// router.get('/:id', getProposalById);

// --- EXPORT THE ROUTER ---
module.exports = router;
