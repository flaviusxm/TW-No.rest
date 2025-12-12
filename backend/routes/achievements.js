const express=require('express');
const router=express.Router();
const {get_achievements}=require('../controllers/achievements_controller');
const {require_auth}=require('../middleware/auth');
router.get('/', require_auth, get_achievements);

module.exports = router;