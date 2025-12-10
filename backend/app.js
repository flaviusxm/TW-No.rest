const express = require("express");
const cors = require("cors");
const database = require("./models");
const session = require('express-session')
const passport = require('passport');
const { require_auth } = require("./middleware/auth");
const subject_routes = require('./routes/subjects');
const note_routes = require('./routes/notes');
const tags_routes = require('./routes/tags');
const group_routes = require('./routes/groups');
const user_routes = require('./routes/user');
const google_auth_routes = require('./routes/google_auth');
require("dotenv").config();

//

const app = express();
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'foarte_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 1,
    },
  })
);
//
app.use(passport.initialize())
app.use(passport.session())

//
database.sequelize.sync().then(async () => {
  console.log('Baza de date este sincronizata !');
  try {
    const Tag = database.tags;
    const tagsToSeed = [
      { tag_id: 1, name: 'Curs' },
      { tag_id: 2, name: 'Seminar' },
      { tag_id: 3, name: 'Diverse' }
    ];
    for (const t of tagsToSeed) {
      const found = await Tag.findByPk(t.tag_id);
      if (!found) {
        await Tag.create(t).catch(e => {
          console.log(`Could not create tag ${t.name} with id ${t.tag_id}:`, e.message);
        });
        console.log(`Tag seed: ${t.name}`);
      }
    }
  } catch (e) {
    console.log("Error:", e);
  }
}).catch((err) => { console.log("Eroare ", err) })

//
app.use('/auth', google_auth_routes)
//app.use('/item-finder',require_auth,require('./routes/advanced_search'))
app.use('/tags', require_auth, tags_routes);
app.use('/subjects', require_auth, subject_routes)
app.use('/notes', require_auth, note_routes);
app.use('/groups', require_auth, group_routes);
app.use('/users', require_auth, user_routes);
const port = process.env.PORT || 9583
app.listen(port, () => { console.log(`Server runs on  ${port}`); });


