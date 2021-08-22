const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const Joi = require('joi'); we have done this in schemas.js
const campController = require('../controllers/campgrounds');
const {campgroundSchema} = require('../schemas.js');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');


router.route('/')
  .get(catchAsync(campController.index))
  .post(isLoggedIn, validateCampground, catchAsync(campController.createCampground));

router.get('/new', isLoggedIn, campController.showNewForm)

router.route('/:id')
  .get(catchAsync(campController.showCampground))
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campController.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campController.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campController.showEditForm))

module.exports = router;
