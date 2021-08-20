const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); // the passport mongoose will hash the password for us.
        req.login(registeredUser, err => { // passport supports that
            if (err) return next(err);
            req.flash('success', 'Welcome to CampBase!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

// passport.authenticate  buil                strategy    flash                redirect
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back to CampBase!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; // we dont want the url in the session
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Successfully logged out!");
    res.redirect('/campgrounds');
})

module.exports = router;