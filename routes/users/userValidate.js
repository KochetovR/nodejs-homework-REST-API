const Joi = require('joi');

const schemaUser = Joi.object({
    email: Joi.string().email().min(1).max(25).required(),
    password: Joi.string().min(8).max(16).required(),
})

const schemaSubscriptionStatus = Joi.object({
    subscription: Joi.string().required(),
})
const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj)
        next()
    } catch (error) {
        res.status(400).json({status: 'error', code: 400, message: `${error.message.replace(/"/g, '')}`})
    }
}

module.exports.validateUser = async(req, res, next) => {
    return await validate(schemaUser, req.body, res, next)
}

module.exports.validateSubscriptionStatus = async(req, res, next) => {
    return await validate(schemaSubscriptionStatus, req.body, res, next)
}
