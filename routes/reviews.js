const express = require(`express`);
const router = express.Router({ mergeParams: true });
const Listing = require(`../models/listing`); // Listing Schema
const wrapAsync = require(`../utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
// const ExpressError = require(`../utils/ExpressError`); // Extends JavaScript Error Class 
// const { reviewSchema } = require(`../schemaValidation`); // Joi Schema Method to validate Schema (Post/Reqs)
const Review = require(`../models/review`); // Review Schema
const { validateReviewSchema} = require(`../middlewares.js`);
const {isLoggedIn} = require(`../middlewares.js`) // Middleware LoggedIn Checks that User is LoggedIn to perform CRUD operations
const reviewController = require(`../controller/review.js`);

/* router.route is used when multiple route has same path. It helps not to write same path repeatedly */

// Creating Review Route
router.post(`/`, isLoggedIn, validateReviewSchema, wrapAsync(reviewController.createNewReview));

// Delete Review Route
router.delete(`/:reviewId`,isLoggedIn, wrapAsync(reviewController.deleteReview));

module.exports = router;