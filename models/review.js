const mongoose = require(`mongoose`);

let reviewSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

const Review = mongoose.model(`Review`, reviewSchema);
module.exports = Review;