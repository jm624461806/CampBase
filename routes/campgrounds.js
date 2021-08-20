const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const Joi = require('joi'); we have done this in schemas.js
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');


router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', {campgrounds});
}))

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
  const campgrounds = new campground(req.body.campground);
  campgrounds.author = req.user._id;
  await campgrounds.save();
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campgrounds._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  // variable campgrounds have access to the reviews and the author
  const campgrounds = await campground.findById(req.params.id).populate('reviews').populate('author');
  if(!campgrounds) {
    req.flash('error', 'Can\'t find the campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', {campgrounds});
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const campgrounds = await campground.findById(req.params.id);
  if(!campgrounds) {
    req.flash('error', 'Can\'t find the campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', {campgrounds});
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) =>{
  const {id} = req.params;
  const campg = await campground.findByIdAndUpdate(id, {...req.body.campground});
  req.flash('success', 'Successfully updated the campground!');
  res.redirect(`/campgrounds/${campg._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) =>{
  const {id} = req.params;
  await campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted the campground!');
  res.redirect('/campgrounds');
}))


module.exports = router;