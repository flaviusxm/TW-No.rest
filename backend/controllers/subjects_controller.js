const database = require('../models');
const Subject = database.subjects;

exports.create_subject = async (req, resp) => {
    try {
        console.log('User autentificat:', req.user);
        console.log('Body request:', req.body);
        
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
            created_on: new_subject.created_on
        });
    }
    catch (err) {
        console.error('Eroare în create_subject:', err);
        resp.status(500).json({ err: 'Server error: ' + err.message });
    }

exports.get_all_subjects=async(req,resp)=>{
    try{
        const subjects=await Subject.findAll({
            order:[['name','ASC']]
        })
        const mapped_subjects=subjects.map(sub=>(
           { id: sub.subject_id,
            name: sub.name,
            description: sub.description,
            created_on: sub.created_on,
           }
        ));
        resp.json(mapped_subjects);
    }catch(err){
        resp.status(500).json({err:err.message})
    }
}
}
exports.delete_subject=async(req,resp)=>{
    try{
        const subject=await Subject.findByPk(req.params.id);
         if (!subject) return resp.status(404).json({ error: 'Subiectul nu a fost gasit' });
    await subject.destroy();
    resp.json({message:'Subiect sters cu succes !'})
        }catch(err){
            resp.status(500).json({err:err.message})
        }
}