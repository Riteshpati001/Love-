const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal'); 

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
    // Expecting req.body to contain proposal fields and potentially media details
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

module.exports = router;
