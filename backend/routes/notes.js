const express=require('express');
const router=express.Router();
const {require_auth}=require('../middleware/auth')
const{create_note,get_all_notes,update_note,delete_note, get_note_by_id}=require('../controllers/notes_controller')
router.post('/',require_auth,create_note);
router.get('/',require_auth,get_all_notes);
router.get('/:id',require_auth,get_note_by_id);
router.put('/:id',require_auth,update_note);
router.delete('/:id',require_auth,delete_note);
module.exports=router;