const ensureAuthenticated = (req, res, next) => {
    console.log('Authenticated user:', req.user); // Debug log
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    }
    res.status(401).json({ message: 'Unauthorized. Please log in with GitHub to access this resource.' });
};

module.exports = ensureAuthenticated;