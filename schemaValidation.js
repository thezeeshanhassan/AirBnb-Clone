const joi = require(`joi`);

//// Validation Schema for Listing
let listeningSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        country: joi.string().required(),
        image: joi.string().allow("", null)

    }).required()
})


//// Validation Schema for Reviews
let reviewSchema = joi.object({
    review: joi.object({
        comment: joi.string().required(),
        rating: joi.number().required().min(1).max(5),
    }).required()
})


module.exports = { reviewSchema, listeningSchema };