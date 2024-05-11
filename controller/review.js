const Listing = require(`../models/listing`); // Listing Schema
const Review = require(`../models/review`); // Review Schema

//// Create New Review Function
module.exports.createNewReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.createdBy = req.user._id;
    // Adding Review to Lisiting
    listing.review.push(newReview);
    listing.save();
    newReview.save();
    req.flash(`success`, "New Review Added Successfully!");
    res.redirect(`/listings/${id}`);
}

//// Delete Review Function
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    let listing = await Listing.findById(id);
    let review = await Review.findById(reviewId);

    if(req.user._id.equals(review.createdBy)) 
    {
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    req.flash(`success`, "Review Deleted Successfully!");
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    }
    else {
        req.flash(`error`, "You are not the righ owner of this Review");
        res.redirect(`/listings/${id}`);
    }
}