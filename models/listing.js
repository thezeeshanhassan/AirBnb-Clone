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
        type: Object,
        set: (v) => v === "" ? "https://www.istockphoto.com/photo/luxurious-villa-with-pool-gm506903162-84462663" : v,
        default: "https://www.istockphoto.com/photo/luxurious-villa-with-pool-gm506903162-84462663",
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
    ]
})

ListingSchema.post(`findOneAndDelete`, async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } });
    }
})
const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;