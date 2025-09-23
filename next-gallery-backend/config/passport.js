const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const User = require("../models/userModel");

// --- Google OAuth Strategy ---
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Log Google profile in terminal
        console.log("Google profile:", JSON.stringify(profile, null, 2));

        // First check if user already exists by email
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          user = await User.create({
            provider: "google",
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
          });
          user.isNew = true;
        } else {
          user.isNew = false;
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --- Discord OAuth Strategy ---
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "/api/auth/discord/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // ✅ Log Discord profile in terminal
        console.log("✅ Google Login Summary:", {
          id: profile.id,
          name: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          email: profile.emails?.[0]?.value,
          photo: profile.photos?.[0]?.value,
          provider: profile.provider,
        });

        let user = await User.findOne({ email: profile.email });

        if (!user) {
          user = await User.create({
            provider: "discord",
            providerId: profile.id,
            email: profile.email,
            name: profile.username,
          });
          user.isNew = true;
        } else {
          user.isNew = false;
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
