const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getExams,
  getExamById,
  submitExam,
  getTips
} = require('../controllers/interviews.controller');

router.get('/questions', getQuestions);
router.get('/exams', getExams);
router.get('/exams/:id', getExamById);
router.post('/exams/:id/submit', submitExam);
router.get('/tips', getTips);

module.exports = router;
