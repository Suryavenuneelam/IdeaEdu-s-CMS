require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const router = express.Router();

// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = new twilio(accountSid, authToken);

// Send verification code to phone
router.post('/send-verification', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required.' });
    }

    try {
        const verification = await client.verify.v2.services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });

        res.status(200).json({ message: 'Verification code sent successfully!', sid: verification.sid });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ error: 'Failed to send verification code.' });
    }
});

// Verify the entered code
router.post('/verify-code', async (req, res) => {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
        return res.status(400).json({ error: 'Phone number and code are required.' });
    }

    try {
        const verification_check = await client.verify.v2.services(serviceSid)
            .verificationChecks
            .create({ to: phoneNumber, code });

        if (verification_check.status === 'approved') {
            res.status(200).json({ message: 'Phone number verified successfully!' });
        } else {
            res.status(400).json({ error: 'Invalid verification code.' });
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ error: 'Failed to verify code.' });
    }
});

module.exports = router;