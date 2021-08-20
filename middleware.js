module.exports.isLoggedIn = (req, res, next) => {
  // this is implemented by Passport associated with the session
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You have to be signed in first!');
    return res.redirect('/login');
  }
  next();
}
