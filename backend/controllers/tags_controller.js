const database=require('../models');
const Tag=database.tags;
const Note=database.notes;

exports.get_all_tags=async(req,resp)=>{
    try{
        const tags=await Tag.findAll({
            order:[['name','ASC']]
        });
        resp.json(tags);
    }catch(err){resp.status(500).json({err:err.message})}
}
exports.create_tag=async(req,resp)=>
{
     try {
    if (!req.body.name?.trim()) {return resp.status(400).json({ error: 'Numele este obligatoriu' });}
    const tag=await Tag.create({name:req.body.name.trim()})
    resp.status(201).json(tag);
}
catch (err){ resp.status(500).json({err:err.message})}
}

exports.update_tag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.body.tag_id);
    if (!tag) {return res.status(404).json({ error: 'Tag-ul nu a fost gasit' });}
    
    await tag.update({name: req.body.name?.trim() || tag.name});
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete_tag = async (req, res) => {
         try {
    const tag = await Tag.findByPk(req.body.tag_id);
    if (!tag) {return res.status(404).json({ error: 'Tag-ul nu a fost gasit' });}
    await tag.destroy();
    res.json({ message: 'Tag sters cu succes' });
  } catch (error) {res.status(500).json({ error: error.message });}
};