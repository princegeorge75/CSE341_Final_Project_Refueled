const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const userModel = require('./models/userModel'); // Import user model

// Load environment variables (only in development)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Serialize user information into the session
passport.serializeUser((user, done) => {
    done(null, user._id); // Save the user ID in the session
});

// Deserialize user information from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findUserById(id); // Retrieve user from the database
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Configure the GitHub OAuth strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID, // Ensure this is set in Render
            clientSecret: process.env.GITHUB_CLIENT_SECRET, // Ensure this is set in Render
            callbackURL: process.env.CALLBACK_URL, // Ensure this is set in Render
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Create or find the user in the database
                const user = await userModel.createUser({
                    githubId: profile.id,
                    username: profile.username,
                    displayName: profile.displayName,
                    profileUrl: profile.profileUrl,
                    emails: profile.emails,
                    accessToken: accessToken, // Store the access token
                });
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

module.exports = passport;