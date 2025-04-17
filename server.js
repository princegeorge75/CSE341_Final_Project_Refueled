const express = require('express');
const session = require('express-session');
const passport = require('./passport'); // Import the Passport configuration
const userController = require('./controllers/userController'); // Import user controller
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const { swaggerUi, specs } = require('./swaggerConfig');
const mongodb = require('./data/database');
const axios = require('axios'); // Import Axios for making HTTP requests

const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(
    session({
        secret: '850b7afa18111722fa47c61729658ff3b4751198',
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/products', require('./routes/products'));
app.use('/customers', require('./routes/customers'));
app.use('/reviews', require('./routes/reviews'));

// GitHub OAuth Routes
app.get(
    '/auth/github',
    passport.authenticate('github', { scope: ['user:email'], prompt: 'login' }) // Force GitHub to prompt for login
);

app.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }), // Handle callback from GitHub
    (req, res) => {
        // Successful authentication
        res.redirect('/profile'); // Redirect to the profile page
    }
);

// User Profile Route
app.get('/profile', userController.getProfile);

// Logout Route with Token Revocation
app.get('/logout', async (req, res, next) => {
    try {
        // Revoke the GitHub token
        const token = req.user?.accessToken; // Retrieve the access token from the user object
        if (token) {
            await axios.post(
                `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/token`,
                { access_token: token },
                {
                    auth: {
                        username: process.env.GITHUB_CLIENT_ID,
                        password: process.env.GITHUB_CLIENT_SECRET,
                    },
                }
            );
        }

        // Log out the user and destroy the session
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.session.destroy(() => {
                res.clearCookie('connect.sid'); // Clear the session cookie
                res.redirect('/'); // Redirect to the home page after logout
            });
        });
    } catch (err) {
        console.error('Failed to revoke GitHub token:', err);
        next(err);
    }
});

// Initialize the database
mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize database', err);
        process.exit(1);
    } else {
        console.log('Database initialized successfully');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});
