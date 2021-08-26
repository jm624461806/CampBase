const campground = require('../models/campground');
const {cloudinary} = require("../cloudinary");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.showNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send()

    const campgrounds = new campground(req.body.campground);
    campgrounds.geometry = geoData.body.features[0].geometry;
    campgrounds.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campgrounds.author = req.user._id;
    await campgrounds.save();
    console.log(campgrounds);
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
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    campg.images.push(...imgs);
    await campg.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campg.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campg._id}`);
  }

module.exports.deleteCampground = async (req, res) =>{
    const {id} = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
  }