const database=require('../models')
const Note=database.notes;
const Subject=database.subjects;
const User=database.users;
exports.create_note=async(req,resp)=>{
    try{
        const {title,content,subject_id}=req.body;
        if(!title || !title.trim() || !content ||!content.trim() ||!subject_id){return resp.status(400).json({err:'Titlul/Continutul/Id ul sunt obligatorii'})}
        const subject=await Subject.findByPk(subject_id);
        if(!subject){return resp.status(404).json({err:'Subiectul nu a fost gasit'})}
        const new_note=await Note.create({
            title:title.trim(),
            content:content.trim(),
            subject_id:subject_id,
            user_id:req.user.id
        })
        resp.json({
            id: new_note.note_id,
            title: new_note.title,
            content: new_note.content,
            subject_id: new_note.subject_id,
            created_on: new_note.created_on,
            updated_on: new_note.updated_on
        })
    }catch(err){resp.status(500).json({err:'Eroare server! '})}
}

exports.get_all_notes = async (req, resp) => {
    try {
        const notes = await Note.findAll({
            include: [
                {
                    model: Subject,
                    attributes: ['subject_id', 'name']
                }
            ],
            order: [['created_at', 'DESC']],
            where: { user_id: req.user.id } 
        });
        
        const mapped_notes = notes.map(note => ({
            id: note.note_id,
            title: note.title,
            content: note.markdown_content,
            subject_id: note.subject_id,
            subject_name: note.Subject ? note.Subject.name : null,
            course_date: note.course_date,
            created_at: note.created_at,
            updated_at: note.updated_at,
            is_markdown: true
        }));
        
        resp.json(mapped_notes);
        
    } catch (err) {
        console.error('Eroare la obtinerea notitelor:', err);
        resp.status(500).json({ err: err.message });
    }
};

exports.get_note_detail_info=async(req,resp)=>{
    try{
const note=await Note.findOne({
    where:{
        note_id:req.params.id,
        user_id:req.user.id
    },
    include:[
        {
            model:Subject,
            attributes:['subject_id','name','description']
        },
        {model:User,
            attributes:['user_id','username','email']
        }
    ]
})
if(!note){return resp.status(404).json({err:err.message})}

  const note_details = {
            title: note.title,
            content: note.markdown_content,
            subject_name: note.Subject ? note.Subject.name : null,
            subject_description: note.Subject ? note.Subject.description : null,
            course_date: note.course_date,
            created_at: note.created_at,
            updated_at: note.updated_at,
            author: note.User ? {username: note.User.username} : null,
            word_count: note.markdown_content ? note.markdown_content.split(/\s+/).length : 0,
            is_markdown: true,
            last_updated: note.updated_at,
          
        };
        
        resp.json(note_details);
    }catch(err){    resp.status(500).json({ err: err.message }); }
}
exports.get_note_by_id=async(req,resp)=>{
    try{
        const note=await Note.findByPk(req.params.id,{
            include:[{model:Subject,attributes:['subject_id','name']}]
        })
        if(!note){return resp.status(404).json({err:'Notita nu a fost gasita'})}
        resp.json({
           id: note.note_id,
            title: note.title,
            content: note.content,
            subject_id: note.subject_id,
            subject_name: note.subject ? note.subject.name : null,
            created_on: note.created_on,
            updated_on: note.updated_on
        })
    }catch(err){resp.status(500).json({err:err.message})}
}
exports.update_note=async(req,resp)=>{
    try{
        const {title,content,subject_id}=req.body;
        const note=await Note.findByPk(req.params.id);
        if(!note){return resp.status(404).json({err:'Notita nu a fost gasita!'})}
        if(subject_id && subject_id!==note.subject_id){
            const subject=await Subject.findByPk(subject_id);
            if(!subject){return resp.status(404).json({err:'Subiectul nu a fost gasit !'})}
        }
        if (title !== undefined) note.title = title.trim();
        if (content !== undefined) note.content = content.trim();
        if (subject_id !== undefined) note.subject_id = subject_id;

        await note.save();
        
        resp.json({
            id: note.note_id,
            title: note.title,
            content: note.content,
            subject_id: note.subject_id,
            updated_on: note.updated_on
        });
    }catch(err){return resp.status(400).json({err:'Eroare update notita !'})}
}
exports.delete_note=async(req,resp)=>{
    try{
        const note=await Note.findByPk(req.params.id);
        if(!note){return resp.status(404).json({err:'Notita nu a fost gasita'})}
        await note.destroy();
        resp.json({message:'Notita stearsa cu succes !'})
    }catch(err){resp.status(500).json({err:err.message})}
}
