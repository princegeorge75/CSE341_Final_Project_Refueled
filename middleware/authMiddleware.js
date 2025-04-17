const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    }
    res.status(401).json({ message: 'Unauthorized. Please log in with GitHub to access this resource.' });
};

module.exports = ensureAuthenticated;