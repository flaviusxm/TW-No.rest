const express = require("express");
const database = require("../models");
const USER = database.users;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const router = express.Router();

// 
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CL_ID,
    clientSecret: process.env.GOOGLE_CL_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await USER.findOne({ where: { google_id: profile.id } });

      if (!user) {
        user = await USER.create({
          google_id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          pictureUrl: profile.photos[0].value,
          last_login: new Date(),
        });
      } else {
        await user.update({ last_login: new Date() });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser(async (user, done) => { done(null, user.user_id) });
passport.deserializeUser(async (id, done) => { 
  try { 
    const user = await USER.findByPk(id); 
    done(null, user); 
  } catch(err) { 
    done(err, null); 
  }
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {res.json({ user: req.user });} else {res.status(401).json({ error: 'Not authenticated' }); }});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/auth-fail" }),(req, res) => {res.redirect("http://localhost:3000/");});


router.get('/logout', (req, resp) => {
  req.logOut((err) => {
    if (err) { return resp.status(500).json({ error: 'Eroare logout' });}
     else {req.session.destroy((err) => {
         if (err) { return resp.status(500).json({ err: "Eroare eliberare sesiune" });}
      resp.clearCookie('connect.sid');
        resp.json({ message: "Logout reusit" });
      });
    }
  });
});

router.get('/auth-fail', (req, resp) => {
  resp.status(401).json({ err: 'Autentificare esuata' });
});

module.exports = router;