const Joi = require('joi');

const patternPhone = '[\\(]\\w{3}[\\)]-\\w{3}-\\w{4}';

const schemaContact = Joi.object({
    name: Joi.string().min(1).max(25).required(),
    email: Joi.string().email().min(1).max(25).required(),
    phone: Joi.string().pattern(new RegExp(patternPhone)).required(),
    favorite: Joi.boolean().optional(),
})

const schemaContactId = Joi.object({
    contactId: Joi.string().required(),
})

const schemaStatusContact = Joi.object({
    favorite: Joi.boolean().required(),
})
const validate = async (schema, obj, res, next) => {
    try {
        await schema.validateAsync(obj)
        next()
    } catch (error) {
        res.status(400).json({status: 'error', code: 400, message: `${error.message.replace(/"/g, '')}`})
    }
}

module.exports.validateContact = async(req, res, next) => {
    return await validate(schemaContact, req.body, res, next)
}

module.exports.validateStatusContact = async(req, res, next) => {
    return await validate(schemaStatusContact, req.body, res, next)
}

module.exports.validateContactId = async(req, res, next) => {
    return await validate(schemaContactId, req.params, res, next)
}