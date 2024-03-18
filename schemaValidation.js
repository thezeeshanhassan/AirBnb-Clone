const joi = require(`joi`);

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

module.exports = listeningSchema;