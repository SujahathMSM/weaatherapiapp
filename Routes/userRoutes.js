const express = require('express');
const router = express.Router();
const { saveuser, getUser } = require('../Controllers/userController');
const User = require('../Models/user');

router.post('/save', saveuser);
router.get('/retrieve', getUser )

module.exports = router;
