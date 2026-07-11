const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  uploadVoiceNote,
  getGallery,
  unlockGallery,
  deleteMedia,
  changePassword,
} = require('../controllers/galleryController');
const { protect } = require('../middlewares/auth');
const { uploadImage, uploadVideo, uploadAudio } = require('../middlewares/upload');

router.post('/upload', protect, (req, res, next) => {
  if (req.headers['content-type']?.startsWith('video/')) {
    uploadVideo.single('media')(req, res, next);
  } else {
    uploadImage.single('media')(req, res, next);
  }
}, uploadMedia);

router.post('/voice', protect, uploadAudio.single('audio'), uploadVoiceNote);
router.get('/:proposalId', getGallery);
router.post('/unlock', unlockGallery);
router.delete('/:mediaId', protect, deleteMedia);
router.put('/password', protect, changePassword);

module.exports = router;
