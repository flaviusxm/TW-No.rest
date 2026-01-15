const express = require('express');
const router = express.Router();
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })
const { require_auth } = require('../middleware/auth')
const { create_note, get_all_notes, update_note, delete_note, get_note_by_id, upload_attachment, delete_attachment } = require('../controllers/notes_controller')
router.post('/', require_auth, create_note);
router.get('/', require_auth, get_all_notes);
router.get('/:id', require_auth, get_note_by_id);
router.put('/:id', require_auth, update_note);
router.post('/:id/attachments', require_auth, upload.single('file'), upload_attachment)
router.delete('/attachments/:attachmentId', require_auth, delete_attachment)
router.delete('/:id', require_auth, delete_note);
module.exports = router;