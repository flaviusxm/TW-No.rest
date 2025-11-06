const express = require("express");
const cors = require("cors");
const database = require("./models");
const USER=database.users;
const app = express();
const session=require('express-session')
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const passport=require('passport');
require("dotenv").config()
app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}));
app.use(express.json());
app.use(session({secret:'super_secret_key',resave:false,saveUninitialized:false,cookie:{secure:false,maxAge:1000*60*60*24}}))
app.use(passport.initialize())
app.use(passport.session())
database.sequelize.sync().then(() => {console.log("All works and synched");}).catch((err) => console.error("Error:", err));

app.get("/", (req, res) => {
  res.send("Backend works also!");
});

//google passport

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CL_ID,
    clientSecret: process.env.GOOGLE_CL_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
  },
  async ( accessToken,refreshToken,profile, done) => {
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

passport.serializeUser(async (user,done)=>{done(null,user.user_id)})
passport.deserializeUser(async(id,done)=>{
try{
  const user=await USER.findByPk(id)
  done(null,user)
}catch(err){
  done(err,null)
}
})
app.get('/auth/status',(req,resp)=>{
  if(req.isAuthenticated()){
    resp.json(req.user_id);
  }else{
    resp.status(401).json({error:'Not authenticated'})
  }
})
app.get("/auth/google",passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/auth/fail" }),
  (req, res) => {
    res.json({ message: "Autentificare Google reusita!" });
  }
);

app.get('/logout',(req,resp)=>{
  req.logOut((err)=>{
    if(err){return resp.status(500).json({error:'Eroare logout'});}
    else{
      resp.json({message:'Logout reusit'})
    }
  })
})
const port = process.env.PORT || 9583
app.listen(port, () => {console.log(`Server runs on  ${port}`);});


