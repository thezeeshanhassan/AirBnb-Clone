const express = require(`express`);
const router = express.Router({ mergeParams: true });
const Listing = require(`../models/listing`); // Listing Schema
const wrapAsync = require(`../utils/wrapAsync`); // Function that Execute Other Functions If Error then throw Error
const ExpressError = require(`../utils/ExpressError`); // Extends JavaScript Error Class 
// const { listeningSchema, reviewSchema } = require(`./schemaValidation`); // Joi Schema Method to validate Schema (Post/Reqs)
const Review = require(`../models/review`); // Review Schema

//// MiddleWares For Schema Validation (Server Side Validation)
// const validateReviewSchema = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let { details } = error;
//         let errMsg = details[0].message;
//         throw new ExpressError(400, errMsg);
//     }
//     else {
//         next();
//     }
// }

// Creating Review Route
router.post(`/`, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);

    // Adding Review to Lisiting
    listing.review.push(newReview);
    listing.save();
    newReview.save();
    res.redirect(`/listings/${id}`);
}))

// Delete Review Route

router.delete(` /:reviewId`, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.findById(reviewId);

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports = router;