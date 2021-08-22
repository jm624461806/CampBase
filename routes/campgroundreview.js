const express = require('express');
const router = express.Router( {mergeParams: true}); // if do not do this, the campground id will not be passed to review router
const catchAsync = require('../utils/catchAsync');
// const Joi = require('joi'); we have done this in schemas.js
const {reviewSchema} = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
// the router controller
const reviewsController = require('../controllers/reviews');

const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');
const Review = require('../models/review');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview))

module.exports = router;