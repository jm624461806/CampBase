const campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.showNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) => {
    const campgrounds = new campground(req.body.campground);
    campgrounds.author = req.user._id;
    await campgrounds.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campgrounds._id}`)
  }

module.exports.showCampground = async (req, res) => {
    // variable campgrounds have access to the reviews and the author
    const campgrounds = await campground.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
        path:'author'
      }
    }).populate('author');
    if(!campgrounds) {
      req.flash('error', 'Can\'t find the campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campgrounds});
  }

module.exports.showEditForm = async (req, res) => {
    const campgrounds = await campground.findById(req.params.id);
    if(!campgrounds) {
      req.flash('error', 'Can\'t find the campground!');
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campgrounds});
  }

module.exports.updateCampground = async (req, res) =>{
    const {id} = req.params;
    const campg = await campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campg._id}`);
  }

module.exports.deleteCampground = async (req, res) =>{
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
  }