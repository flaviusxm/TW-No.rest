const express = require('express');
const router = express.Router();
const { require_auth } = require('../middleware/auth');
const { 
    create_group, 
    get_all_groups, 
    delete_group, 
    get_group_notes, 
    get_group_members, // <--- NOU
    get_group_count,
    add_member,
    add_note
} = require('../controllers/groups_controller');

router.post('/', require_auth, create_group);
router.get('/', require_auth, get_all_groups);

// Get Data
router.get('/:id', require_auth, get_group_notes);       // Note
router.get('/:id/members', require_auth, get_group_members); // Membri (NOU)
router.get('/:id/count', require_auth, get_group_count);

router.delete('/:id', require_auth, delete_group);

// Actions
router.post('/:id/members', require_auth, add_member);
router.post('/:id/notes', require_auth, add_note);

module.exports = router;