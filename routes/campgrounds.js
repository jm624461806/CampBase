const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const Joi = require('joi'); we have done this in schemas.js
const {campgroundSchema} = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');

// middleware which can selectively applied in some middlewares
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await campground.find({});
  res.render('campgrounds/index', {campgrounds});
}))

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async(req, res, next) => {
  const campgrounds = new campground(req.body.campground);
  await campgrounds.save();
  res.redirect(`/campgrounds/${campgrounds._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
  const campgrounds = await campground.findById(req.params.id).populate('reviews');
  res.render('campgrounds/show', {campgrounds});
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const campgrounds = await campground.findById(req.params.id);
  res.render('campgrounds/edit', {campgrounds});
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) =>{
  const {id} = req.params;
  const camp = await campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) =>{
  const {id} = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))


module.exports = router;