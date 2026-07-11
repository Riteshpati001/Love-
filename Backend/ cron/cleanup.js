const cron = require('node-cron');
const Proposal = require('../models/Proposal');
const Gallery = require('../models/Gallery');
const VoiceNote = require('../models/VoiceNote');
const ProposalResponse = require('../models/ProposalResponse');
const { cloudinary } = require('../config/cloudinary');

const cleanupExpiredData = async () => {
  try {
    const now = new Date();
    console.log(`[Cleanup] Running cleanup job at ${now.toISOString()}`);

    const expiredProposals = await Proposal.find({ expiresAt: { $lte: now } });
    console.log(`[Cleanup] Found ${expiredProposals.length} expired proposals`);

    for (const proposal of expiredProposals) {
      const galleryItems = await Gallery.find({ proposalId: proposal._id });
      for (const item of galleryItems) {
        try {
          await cloudinary.uploader.destroy(item.publicId);
        } catch (err) {
          console.error(`[Cleanup] Failed to delete Cloudinary resource ${item.publicId}:`, err.message);
        }
      }
      await Gallery.deleteMany({ proposalId: proposal._id });

      const voiceNotes = await VoiceNote.find({ proposalId: proposal._id });
      for (const note of voiceNotes) {
        try {
          await cloudinary.uploader.destroy(note.publicId);
        } catch (err) {
          console.error(`[Cleanup] Failed to delete Cloudinary audio ${note.publicId}:`, err.message);
        }
      }
      await VoiceNote.deleteMany({ proposalId: proposal._id });

      await ProposalResponse.deleteMany({ proposalId: proposal._id });

      await Proposal.findByIdAndDelete(proposal._id);
      console.log(`[Cleanup] Deleted proposal ${proposal._id} (${proposal.uniqueLink})`);
    }

    console.log('[Cleanup] Cleanup job completed successfully');
  } catch (error) {
    console.error('[Cleanup] Cleanup job failed:', error.message);
  }
};

const startCleanupJob = () => {
  cron.schedule('0 0 * * *', () => {
    cleanupExpiredData();
  });
  console.log('[Cleanup] Scheduled cleanup job to run daily at midnight');
};

module.exports = { startCleanupJob, cleanupExpiredData };
