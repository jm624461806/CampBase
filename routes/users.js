const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const usersController = require('../controllers/users');


router.route('/register')
    .get(usersController.renderRegister)
    .post(catchAsync(usersController.register));

router.route('/login')
    .get(usersController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.login);
// passport.authenticate  buil  strategy    flash                redirect

router.get('/logout', usersController.logout);

module.exports = router;