const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: '1030724503574-l2afgi26hll2u0sen95gsvn21tdjka57.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    // Check if user already exists in our db
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      // Already have this user
      return done(null, existingUser);
    }

    // If not, create a new user in our db
    const newUser = await new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    }).save();

    done(null, newUser);
  }
));

// Serialize user id into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user id from session
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});



