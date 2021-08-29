const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampGroundSchema = new Schema({
  title: String,
  images: [ImageSchema],

  geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
  },
  price: Number, 
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]

}, opts);

CampGroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`
});

// mongoose query middleware to delete all the review associated with the deleted campground 
CampGroundSchema.post('findOneAndDelete', async function (doc) { // because we use findbyIDanddelete so we use findOneAndDelete
  if (doc) {
      await Review.deleteMany({
          _id: {
              $in: doc.reviews // id in doc reviews section
          }
      })
  }
})

module.exports = mongoose.model('Campground', CampGroundSchema); // the collection will be named as campgrounds