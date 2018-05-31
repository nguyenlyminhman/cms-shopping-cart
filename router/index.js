const express = require('express');
const router = express.Router();
let userRouter = require('./userRouter');
let adminRouter = require('./adminRouter');

router.use('/', userRouter);

router.use('/admin', adminRouter);

module.exports = router;