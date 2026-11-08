const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseResume, enhanceText } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');

// In-memory file upload storage (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.use(protect);

router.post('/parse-resume', upload.single('file'), parseResume);
router.post('/enhance-text', enhanceText);

module.exports = router;
