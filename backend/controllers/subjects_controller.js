const database = require('../models');
const Subject = database.subjects;
const Note=database.notes;
exports.create_subject = async (req, resp) => {
    try {
        if (!req.body.name || !req.body.name.trim()) {
            return resp.status(400).json({ err: 'Numele este obligatoriu' });
        }
        
        const new_subject = await Subject.create({
            name: req.body.name.trim(),
        });
        
        console.log('Subiect creat:', new_subject);
         resp.json({
            id: new_subject.subject_id,
            name: new_subject.name,
            description: new_subject.description,
            created_at: new_subject.created_on
        });
    }
    catch (err) {
        console.error('Eroare în create_subject:', err);
        resp.status(500).json({ err: 'Server error: ' + err.message });
    }
}

exports.get_subject_notes = async (req, resp) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) return resp.status(404).json([]);
        
        const notes = await Note.findAll({ 
            where: { 
                subject_id: req.params.id, 
                user_id: req.user.user_id 
            }, 
            order: [['created_at', 'DESC']] 
        });
        
        const mapped = notes.map(n => ({
            id: n.note_id,
            title: n.title,
            description: n.description || '',
            content: n.markdown_content,
            subject_id: n.subject_id,
            subject_name: subject.name,
            created_at: n.created_at,
            updated_at: n.updated_at,
        }));
        
        resp.json(mapped);
    } catch (err) {
        resp.status(500).json([]);
    }
}
exports.get_notes_count = async (req, resp) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) {
            return resp.status(404).json({ 
                error: 'Subiectul nu a fost gasit' 
            });
        }
        
        const notes_counter = await Note.count({
            where: { 
                subject_id: req.params.id,
                user_id: req.user.user_id 
            }
        });
        
        resp.json({
            subject_id: parseInt(req.params.id),
            subject_name: subject.name,
            notes_count: notes_counter
        });
    } catch (err) {
        console.error('Error getting subject count:', err);
        resp.status(500).json({ err: err.message });}
}

exports.get_all_subjects = async (req, resp) => {
    try {
        const userNotes = await Note.findAll({
            where: { user_id: req.user.user_id },
            attributes: ['subject_id'],
            group: ['subject_id']
        });
        
        const subject_ids = userNotes.map(note => note.subject_id);
        
        const subjects = await Subject.findAll({
            where: {
                subject_id: subject_ids
            },
            order: [['name', 'ASC']]
        });
        
        const mapped_subjects = subjects.map(sub => ({
            id: sub.subject_id,
            name: sub.name,
            description: sub.description,
            created_at: sub.created_on,
        }));
        
        resp.json(mapped_subjects);
    } catch (err) {
        console.error('Error getting subjects:', err);
        resp.status(500).json({ err: err.message });
    }
};
exports.get_subject_notes_count=async(req,resp)=>{
    try{
        const subject=await Subject.findByPk(req.params.id);
        if(!subject){return resp.status(404).json({err:'Subiectul nu a fost gasit'})}
        const notes_counter=await Note.count({where:{subject_id:req.params.id}})
        resp.json({
            subject_id:parseInt(req.params.id),
            subject_name:subject.name,
            notes_count:notes_counter
        })
    }catch(err){resp.status(500).json({err:err.message})}
}
exports.delete_subject=async(req,resp)=>{
    try{
        const subject=await Subject.findByPk(req.params.id);
         if (!subject) return resp.status(404).json({ error: 'Subiectul nu a fost gasit' });
    await subject.destroy();
    resp.json({message:'Subiect sters cu succes !'})
        }catch(err){resp.status(500).json({err:err.message})}
}