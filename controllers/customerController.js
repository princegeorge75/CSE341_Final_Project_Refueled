const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');
const customerSchema = require('../models/customerModel');

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Retrieve a list of customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 */
const getAllCustomers = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customers = await db.collection('customers').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ error: 'An error occurred while fetching customers' });
    }
};

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Retrieve a single customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: A single customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
const getSingleCustomer = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customerId = new ObjectId(req.params.id);
        const customer = await db.collection('customers').findOne({ _id: customerId });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(customer);
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json({ error: 'An error occurred while fetching the customer' });
    }
};

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: The created customer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Validation error
 *       500:
 *         description: An error occurred while creating the customer
 */
const createCustomer = async (req, res) => {
    try {
        // Validate the request body using the customer schema
        const { error, value } = customerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map((detail) => detail.message),
            });
        }

        const db = mongodb.getDatabase();
        const response = await db.collection('customers').insertOne(value);
        res.status(201).json(response);
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ error: 'An error occurred while creating the customer' });
    }
};

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update an existing customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       204:
 *         description: Customer updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: An error occurred while updating the customer
 */
const updateCustomer = async (req, res) => {
    try {
        // Validate the request body using the customer schema
        const { error, value } = customerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map((detail) => detail.message),
            });
        }

        const db = mongodb.getDatabase();
        const customerId = new ObjectId(req.params.id);
        const response = await db.collection('customers').replaceOne({ _id: customerId }, value);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'An error occurred while updating the customer' });
        }
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ error: 'An error occurred while updating the customer' });
    }
};

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       204:
 *         description: Customer deleted successfully
 *       500:
 *         description: An error occurred while deleting the customer
 */
const deleteCustomer = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const customerId = new ObjectId(req.params.id);
        const response = await db.collection('customers').deleteOne({ _id: customerId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'An error occurred while deleting the customer' });
        }
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: 'An error occurred while deleting the customer' });
    }
};

module.exports = {
    getAllCustomers,
    getSingleCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};