const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

// the routers
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/campgroundreview');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// parse the req.body (post new campground)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))) // to have public directory so no need to /punlic

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Ooooops!! Something Went Wrong!'
  res.status(statusCode).render('./partials/error', { err })
})

app.listen(3000, ()=>{
  console.log('Serving on port 3000')
})