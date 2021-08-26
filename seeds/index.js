const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// db  name: yelp-camp
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// pick a random element from an array
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    const price = Math.floor(Math.random() * 20) + 10;
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '6120220445115f670c8901c5',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/diznkioow/image/upload/v1629766090/CampBase/jqtwiwxk2akmukz7dy2g.jpg',
                  filename: 'CampBase/jqtwiwxk2akmukz7dy2g'
                },
                {
                  url: 'https://res.cloudinary.com/diznkioow/image/upload/v1629766090/CampBase/adwqnwbug4iekbbbgd9h.jpg',
                  filename: 'CampBase/adwqnwbug4iekbbbgd9h'
                }
              ],
            description:"dadadasdsadasdasdasdasd",
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})