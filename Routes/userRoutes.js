const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { saveUser, getUser, updateLocation,getAllUserData, getAnyData} = require('../Controllers/userController');
const User = require('../Models/user');

router.get('/', (req, res) => res.send("App is live now"))
router.post('/save', [
    check('email').isEmail().withMessage('Invalid email address'),
    check('location').notEmpty().withMessage('Location is required')
], saveUser);

router.get('/retrieve', [
    check('email').isEmail().withMessage('Invalid email address'),
    check('date').isISO8601().withMessage('Invalid date format, use YYYY-MM-DD Format')
], getUser);

router.put('/update-location',  [
    check('email').isEmail().withMessage('Invalid email address'),
    check('location').notEmpty().withMessage('Location is required')
],updateLocation )

router.get('/view',  [
    check('email').isEmail().withMessage('Invalid email address')
],getAllUserData)

router.get('/any',  [
    check('email').isEmail().withMessage('Invalid email address'),
    check('date').isISO8601().withMessage('Invalid date format, use YYYY-MM-DD Format')
],getAnyData)

module.exports = router;
