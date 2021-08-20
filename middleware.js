const {campgroundSchema, reviewSchema} = require('./schemas.js');
const campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
 
module.exports.isLoggedIn = (req, res, next) => {
  // this is implemented by Passport associated with the session
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You have to be signed in first!');
    return res.redirect('/login');
  }
  next();
}

// middleware which can selectively applied in some middlewares
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

// middleware which check if the current user is the author of the campground associated with
module.exports.isAuthor = async (req, res, next) => {
  const {id} = req.params;
  const camp = await campground.findById(id);
  if(!camp.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission!');
    return res.redirect(`/campgrounds/${camp._id}`);
  }
  next();
}


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission!');
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}