const { string } = require("joi");
const mongoose = require(`mongoose`);
const Review = require(`./review.js`);
// const Schema = mongoose.Schema;

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true, 
    },
    image: {
       url : String,
       filenmae : String
    },
    price: {
        type: Number,
        require: true,
    },
    location: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

ListingSchema.post(`findOneAndDelete`, async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
})
const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;