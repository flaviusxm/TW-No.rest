const express = require('express');
const database = require('../models');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tags = await database.tags.findAll({order: [['name', 'ASC']]});
    res.json(tags);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!req.body.name?.trim()) {return res.status(400).json({ error: 'Numele este obligatoriu' });}
    const tag = await database.tags.create({
      name: req.body.name.trim()
    });
    res.status(201).json(tag);
  } catch (err){res.status(500).json({ err: err.message });}
});

router.put('/', async (req, res) => {
  try {
    const tag = await database.tags.findByPk(req.body.tag_id);
    if (!tag) {return res.status(404).json({ error: 'Tag-ul nu a fost gasit' });}
    await tag.update({name: req.body.name?.trim() || tag.name});
    res.json(tag);
  } catch (error) {res.status(500).json({ error: error.message });}
});

router.delete('/', async (req, res) => {
  try {
    const tag = await database.tags.findByPk(req.body.tag_id);
    if (!tag) {return res.status(404).json({ error: 'Tag-ul nu a fost gasit' });}
    await tag.destroy();
    res.json({ message: 'Tag sters cu succes' });
  } catch (error) {res.status(500).json({ error: error.message });}
});

module.exports = router;