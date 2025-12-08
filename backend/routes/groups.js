const express = require('express');
const router = express.Router();
const { require_auth } = require('../middleware/auth');
const { 
    create_group, 
    get_all_groups, 
    delete_group, 
    get_group_notes, 
    get_group_count 
} = require('../controllers/groups_controller');

router.post('/', require_auth, create_group);
router.get('/', require_auth, get_all_groups);
router.get('/:id', require_auth, get_group_notes);
router.get('/:id/count', require_auth, get_group_count);
router.delete('/:id', require_auth, delete_group);

module.exports = router;