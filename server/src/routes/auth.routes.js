const express = require('express');
const router = express.Router();
const { register, login, getMe, upgradePlan } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/upgrade', protect, upgradePlan);

module.exports = router;
