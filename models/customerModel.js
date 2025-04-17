const Joi = require('joi');

const customerSchema = Joi.object({
    firstName: Joi.string().required().messages({
        'string.empty': 'First name is required',
    }),
    lastName: Joi.string().required().messages({
        'string.empty': 'Last name is required',
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required',
    }),
    phoneNumber: Joi.string().pattern(/^\d+$/).required().messages({
        'string.pattern.base': 'Phone number must contain only digits',
        'any.required': 'Phone number is required',
    }),
    createdAt: Joi.date().required().messages({
        'date.base': 'CreatedAt must be a valid date',
        'any.required': 'CreatedAt is required',
    }),
});

module.exports = customerSchema;