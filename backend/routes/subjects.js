const express = require('express');
const database = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const subjects = await database.subjects.findAll({
      where: { user_id: req.user.user_id },
      order: [['name', 'ASC']]
    });
    res.json(subjects);
  } 
  catch (error) {res.status(500).json({ error: error.message });}
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.name?.trim()) {return res.status(400).json({ error: 'Numele este obligatoriu' });}
    const subject = await database.subjects.create({
      name: req.body.name.trim(),
      description: req.body.description?.trim(),
      user_id: req.user.user_id
    });
    res.status(201).json(subject);
  } catch (error) {res.status(500).json({ error: error.message });}
});

router.put('/', async (req, res) => {
  try {
    const subject = await database.subjects.findOne({
      where: { 
        subject_id: req.body.subject_id, 
        user_id: req.user.user_id 
      }
    });
     if (!subject) {return res.status(404).json({ error: 'Subiectul nu a fost gasit' });}
    
    await subject.update({
      name: req.body.name?.trim() || subject.name,
      description: req.body.description?.trim() || subject.description 
    });
    
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const subject = await database.subjects.findOne({
      where: { 
        subject_id: req.body.subject_id,
        user_id: req.user.user_id 
      }
    });
    
    if (!subject) {return res.status(404).json({ error: 'Subiectul nu a fost gasit' });}
    await subject.destroy();
    res.json({ message: 'Subiect sters cu succes' });
  } catch (error) { res.status(500).json({ error: error.message });  }
});

module.exports = router;