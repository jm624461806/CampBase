const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
  title: String,
  image: String,
  price: Number, 
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]

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