
const express = require('express');
const router = express.Router();
const { require_auth } = require('../middleware/auth')
const { search_users, get_user_badges } = require('../controllers/user_controller')
router.get('/search', require_auth, search_users);
router.get('/badges', require_auth, get_user_badges);
module.exports = router;