const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { saveUser, getUser, updateLocation,getAllUserData, getAnyData, deleteUser} = require('../Controllers/userController');
const User = require('../Models/user');
const validateToken = require('../Middleware/validateTokenHandler');

router.get('/', (req, res) => res.send("App is live now"))
router.use(validateToken)


router.post('/save', [
    // validation check
    check('email').isEmail().withMessage('Invalid email address'),
    check('location').notEmpty().withMessage('Location is required')
], saveUser);

router.get('/retrieve', [
   check('date').isISO8601().withMessage('Invalid date format, use YYYY-MM-DD Format')
], getUser);

router.put('/update-location',  [
    check('newLocation').notEmpty().withMessage('Location is required')
],updateLocation )

router.get('/view', getAllUserData)

router.get('/any',  [
    check('date').isISO8601().withMessage('Invalid date format, use YYYY-MM-DD Format')
],getAnyData)

router.delete('/delete', deleteUser )

module.exports = router;
