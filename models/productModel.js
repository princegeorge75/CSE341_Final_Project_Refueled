const mongoose = require('mongoose');
const Joi = require('joi');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true }, // Use String to include the dollar symbol
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const validationSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Description is required',
    }),
    price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required',
    }),
    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'Stock must be a number',
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock cannot be negative',
        'any.required': 'Stock is required',
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Category is required',
    }),
    imageUrl: Joi.string().uri().required().messages({
        'string.uri': 'Image URL must be a valid URI',
        'any.required': 'Image URL is required',
    }),
    createdAt: Joi.date().required().messages({
        'date.base': 'CreatedAt must be a valid date',
        'any.required': 'CreatedAt is required',
    }),
});

module.exports = { Product, validationSchema };