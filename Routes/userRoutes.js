const express = require('express');
const router = express.Router();
const { saveUser, getUser, updateLocation } = require('../Controllers/userController');
const User = require('../Models/user');

router.post('/save', saveUser);
router.get('/retrieve', getUser )
router.put('/update-location', updateLocation )

module.exports = router;
