const Joi = require('joi')
const ExpressError = require('./ExpressError')

module.exports = validateInfoCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            image: Joi.string().required(),
            price: Joi.number().min(10).required(),
            description: Joi.string().required(),
            location: Joi.string().required()
        }).required()
    })
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg= error. details.map(elm => elm.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}
