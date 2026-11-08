const express = require('express');
const router = express.Router();
const {
  getAllCVs,
  getCVById,
  createCV,
  updateCV,
  deleteCV,
  duplicateCV
} = require('../controllers/cv.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // All CV routes require authentication

router.route('/')
  .get(getAllCVs)
  .post(createCV);

router.route('/:id')
  .get(getCVById)
  .put(updateCV)
  .delete(deleteCV);

router.post('/:id/duplicate', duplicateCV);

module.exports = router;
