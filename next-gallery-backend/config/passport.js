// config/passport.js
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
        console.log("Google profile:", JSON.stringify(profile, null, 2));

        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ email });

        const firstName =
          profile.name?.givenName || profile.displayName?.split(" ")[0];
        const lastName =
          profile.name?.familyName ||
          profile.displayName?.split(" ").slice(1).join(" ");
        const avatar = profile.photos?.[0]?.value || "";

        // Google profile usually doesn’t include phone by default
        const phone = profile._json?.phoneNumber || "";

        if (!user) {
          // New user
          user = await User.create({
            provider: "google",
            providerId: profile.id,
            email,
            firstName,
            lastName,
            avatar,
            phone, // save phone if exists
            role: "User", // 🔥 ensure a default role
          });
          user.isNew = true;
        } else {
          // Update only if missing
          if (!user.firstName) user.firstName = firstName;
          if (!user.lastName) user.lastName = lastName;
          if (!user.avatar) user.avatar = avatar;
          if (!user.phone && phone) user.phone = phone;
          if (!user.providerId) user.providerId = profile.id;
          if (!user.provider) user.provider = "google";

          await user.save();
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
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("✅ Discord Login Summary:", {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar,
        });

        let user = await User.findOne({ email: profile.email });

        const firstName = profile.username?.split(" ")[0];
        const lastName = profile.username?.split(" ").slice(1).join(" ");
        const avatar = profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : "";

        // Discord doesn’t provide phone by default unless extra scopes
        const phone = profile.phone || "";

        if (!user) {
          user = await User.create({
            provider: "discord",
            providerId: profile.id,
            email: profile.email,
            firstName,
            lastName,
            avatar,
            phone, // save phone if exists
            role: "User", // 🔥 ensure a default role
          });
          user.isNew = true;
        } else {
          if (!user.firstName) user.firstName = firstName;
          if (!user.lastName) user.lastName = lastName;
          if (!user.avatar) user.avatar = avatar;
          if (!user.phone && phone) user.phone = phone;
          if (!user.providerId) user.providerId = profile.id;
          if (!user.provider) user.provider = "discord";

          await user.save();
          user.isNew = false;
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
