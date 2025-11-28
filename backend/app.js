const express = require("express");
const cors = require("cors");
const database = require("./models");
const USER=database.users;
const session=require('express-session')
const passport=require('passport');
const { require_auth } = require("./middleware/auth");
const subject_routes=require('./routes/subjects')
require("dotenv").config();

//

const app=express();
app.use(cors({origin:'http://localhost:3000',credentials:true}));
app.use(express.json());    
app.use(
  session
  ({
  secret: process.env.SESSION_SECRET || 'foarte_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    sameSite: "lax", 
    maxAge: 1000 * 60 * 60 * 1
  }
})
);
//
app.use(passport.initialize())
app.use(passport.session())

//
database.sequelize.sync().then(()=>{
  console.log('Baza de date este sincronizata !');
}).catch((err)=>{console.log("Eroare ",err)})

//
app.use('/auth',require('./routes/google_auth'))
app.use('/item-finder',require_auth,require('./routes/advanced_search'))
app.use('/tags', require_auth, require('./routes/tags'));
app.use('/subjects',require_auth,subject_routes)
const port = process.env.PORT || 9583
app.listen(port, () => {console.log(`Server runs on  ${port}`);});


