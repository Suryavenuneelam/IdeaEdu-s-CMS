const express = require('express');
const router = express.Router();
const { getCallLogs, getCallLogById, updateCallLog } = require('../controllers/logController');

router.get('/logs', getCallLogs);

router.get('/logs/:logId', getCallLogById); 

router.put('/logs/:logId', updateCallLog);


module.exports = router;