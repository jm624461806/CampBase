const express = require('express');
const router = express.Router( {mergeParams: true}); // if do not do this, the campground id will not be passed to review router
const catchAsync = require('../utils/catchAsync');
// const Joi = require('joi'); we have done this in schemas.js
const {reviewSchema} = require('../schemas.js');
const {validateReview} = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');
const Review = require('../models/review');

router.post('/', validateReview, catchAsync(async (req, res) => {
  const campgrounds = await campground.findById(req.params.id); 
  const review = new Review(req.body.review);
  campgrounds.reviews.push(review);
  await review.save();
  await campgrounds.save();
  req.flash('success', 'Successfully published a new review!');
  res.redirect(`/campgrounds/${campgrounds._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // delete specific review with specific ID
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;