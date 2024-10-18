const express = require('express');
const cors = require('cors');
const { login, refreshToken, forgotPassword, resetPassword} = require('../controllers/login');
const router = express.Router();

// Enable CORS for this router
router.use(cors());

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;