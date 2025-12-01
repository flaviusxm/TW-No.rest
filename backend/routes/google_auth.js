const express = require("express");
const passport = require('passport');
const router = express.Router();
const google_controller=require('../controllers/google_controller')
google_controller.configure_passport()

router.get('/status',google_controller.get_auth_status);
router.get('/google',passport.authenticate("google",{scope:['profile','email']}))
router.get('/google/callback',passport.authenticate("google",{failureRedirect:"/auth/auth-fail"}),google_controller.google_auth_success)
router.get('/logout',google_controller.logout);
router.post('/logout',google_controller.logout);
router.get('/auth-fail',google_controller.auth_fail)
module.exports = router;