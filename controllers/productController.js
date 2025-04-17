const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');
const productSchema = require('../models/productModel');
const Product = require('../models/productModel');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
const getAll = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const products = await db.collection('products').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'An error occurred while fetching products' });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
const getSingle = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const productId = new ObjectId(req.params.id);
        const product = await db.collection('products').findOne({ _id: productId });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'An error occurred while fetching the product' });
    }
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       500:
 *         description: An error occurred while creating the product
 */
const createProduct = async (req, res) => {
    try {
        // Validate the request body using the product schema
        const { error, value } = productSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                error: 'Validation error',
                details: error.details.map((detail) => detail.message),
            });
        }

        const db = mongodb.getDatabase();
        const response = await db.collection('products').insertOne(value);
        res.status(201).json(response);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'An error occurred while creating the product' });
    }
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error
 *       500:
 *         description: An error occurred while adding the product
 */
const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        // Validate input
        if (!name || !description || price == null || stock == null) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Ensure price and stock are numbers
        const parsedPrice = parseFloat(price);
        const parsedStock = parseInt(stock, 10);

        if (isNaN(parsedPrice) || isNaN(parsedStock)) {
            return res.status(400).json({ message: 'Price and stock must be valid numbers.' });
        }

        const product = new Product({
            name,
            description,
            price: parsedPrice,
            stock: parsedStock,
        });

        const result = await product.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding product:', error); // Log the full error
        res.status(500).json({ message: 'Failed to add product.', error: error.message || error });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *       500:
 *         description: An error occurred while updating the product
 */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock } = req.body;

        // Validate input
        if (!name || !description || price == null || stock == null) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { name, description, price, stock },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product.', error });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       500:
 *         description: An error occurred while deleting the product
 */
const deleteProduct = async (req, res) => {
    try {
        const db = mongodb.getDatabase();
        const productId = new ObjectId(req.params.id);
        const response = await db.collection('products').deleteOne({ _id: productId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'An error occurred while deleting the product' });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'An error occurred while deleting the product' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createProduct,
    addProduct,
    updateProduct,
    deleteProduct,
};