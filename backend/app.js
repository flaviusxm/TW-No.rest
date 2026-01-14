const express = require("express");
const cors = require("cors");
const database = require("./models");
const session = require('express-session')
const passport = require('passport');
const path = require('path');
const { require_auth } = require("./middleware/auth");
const subject_routes = require('./routes/subjects');
const note_routes = require('./routes/notes');
const tags_routes = require('./routes/tags');
const group_routes = require('./routes/groups');
const user_routes = require('./routes/user');
const google_auth_routes = require('./routes/google_auth');
const achievements_routes = require('./routes/achievements');
require("dotenv").config();

//

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
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
    // seed pt tags 
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

    // seed pt badges

    const badges_data = [
      { name: 'Rookie', icon_url: 'rookie' },
      { name: 'Scribe', icon_url: 'scribe' },
      { name: 'Scholar', icon_url: 'scholar' },
      { name: 'Wordsmith', icon_url: 'wordsmith' },
      { name: 'Novel Writer', icon_url: 'novel_writer' },
      { name: 'The Perfectionist', icon_url: 'the_perfectionist' },
      { name: 'Time Traveler', icon_url: 'time_traveler' },
      { name: 'Daily Chronicler', icon_url: 'daily_chronicler' },
      { name: 'The Pioneer', icon_url: 'the_pioneer' },
      { name: 'Polymath', icon_url: 'polymath' },
      { name: 'Deep Diver', icon_url: 'deep_diver' },
      { name: 'The Tagger', icon_url: 'the_tagger' },
      { name: 'The Connector', icon_url: 'the_connector' },
      { name: 'Minimalist', icon_url: 'minimalist' },
      { name: 'Resource Gatherer', icon_url: 'resource_gatherer' },
      { name: 'Visual Learner', icon_url: 'visual_learner' },
      { name: 'The Streamer', icon_url: 'the_streamer' },
      { name: 'Researcher', icon_url: 'researcher' },
      { name: 'Multimedia Master', icon_url: 'multimedia_master' },
      { name: 'The Founder', icon_url: 'the_founder' },
      { name: 'Community Leader', icon_url: 'community_leader' },
      { name: 'Squad Goals', icon_url: 'squad_goals' },
      { name: 'Night Owl', icon_url: 'night_owl' },
      { name: 'Early Bird', icon_url: 'early_bird' },
      { name: 'Marathon Runner', icon_url: 'marathon_runner' },
      { name: 'Spring Cleaner', icon_url: 'spring_cleaner' },
      { name: 'Full Stack', icon_url: 'full_stack' },
      { name: 'The Architect', icon_url: 'the_architect' },
      { name: 'Open Source', icon_url: 'open_source' },
      { name: 'Infinity Gauntlet', icon_url: 'infinity_gauntlet' }
    ];

    const seed_badges = async () => {
      for (const badge of badges_data) {
        await database.badges.findOrCreate({
          where: { name: badge.name },
          defaults: badge
        });
      }
      console.log('Badges seeded!');
    };
    await seed_badges();
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
app.use('/achievements', require_auth, achievements_routes);
const port = process.env.PORT || 9583
app.listen(port, () => { console.log(`Server runs on  ${port}`); });


