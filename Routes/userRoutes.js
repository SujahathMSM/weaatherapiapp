const express = require('express');
const router = express.Router();
const { saveUser, getUser, updateLocation,getAllUserData, getAnyData} = require('../Controllers/userController');
const User = require('../Models/user');

router.get('/', (req, res) => res.send("App is live now"))
router.post('/save', saveUser);
router.get('/retrieve', getUser )
router.put('/update-location', updateLocation )
router.get('/view', getAllUserData)
router.get('/any', getAnyData)

module.exports = router;
