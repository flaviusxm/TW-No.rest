// routes/subjects.js
const express = require('express');
const router = express.Router();
const { require_auth } = require('../middleware/auth');
const {create_subject,get_all_subjects,delete_subject, get_subject_notes,get_notes_count} = require('../controllers/subjects_controller');


router.post('/', require_auth, create_subject);

router.get('/', require_auth, get_all_subjects);
router.get('/:id', require_auth, get_subject_notes);
router.get('/:id/count', require_auth, get_notes_count);
router.delete('/:id', require_auth, delete_subject);

module.exports = router;