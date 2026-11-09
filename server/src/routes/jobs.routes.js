const express = require('express');
const router = express.Router();
const {
  getJobs,
  getLatestJobs,
  getCountries,
  getJobById,
  askJobBot
} = require('../controllers/jobs.controller');

router.get('/', getJobs);
router.get('/latest', getLatestJobs);
router.get('/countries', getCountries);
router.get('/:id', getJobById);
router.post('/bot-ask', askJobBot);

module.exports = router;
