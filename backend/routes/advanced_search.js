const express = require('express')
const database = require('../models')
const { Op } = require("sequelize")
const {validate_search_query}=require('../middleware/validate_search_item_query')
const router = express.Router()

router.get('/global',validate_search_query,async (req, res) => {
  try {
    if (!req.query.q?.trim() || req.query.q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query too short' })
    }

    const [notes, subjects, tags, groups, shared_notes] = await Promise.all([
      
      database.notes.findAll({
        where: {
          user_id: req.user.user_id,
          [Op.or]: [
            { title: { [Op.iLike]: `%${req.query.q.trim()}%` } },
            { markdown_content: { [Op.iLike]: `%${req.query.q.trim()}%` } }
          ]
        },
        include: [{ model: database.subjects, attributes: ['name'] }],
        limit: 30
      }),

      
      database.subjects.findAll({
        where: {
          user_id: req.user.user_id,
          [Op.or]: [
            { name: { [Op.iLike]: `%${req.query.q.trim()}%` } },
            { description: { [Op.iLike]: `%${req.query.q.trim()}%` } }
          ]
        },
        limit: 20
      }),

      
      database.tags.findAll({
        where: { name: { [Op.iLike]: `%${req.query.q.trim()}%` } },
        include: [{
          model: database.notes,
          where: { user_id: req.user.user_id },
          attributes: [],
          through: { attributes: [] }
        }],
        limit: 15
      }),

      
      database.study_groups.findAll({
        where: {
          name: { [Op.iLike]: `%${req.query.q.trim()}%` },
          [Op.or]: [
            { created_by: req.user.user_id },
            { '$GroupMembers.user_id$': req.user.user_id }
          ]
        },
        include: [{ model: database.users, as: 'creator', attributes: ['name'] }],
        limit: 15
      }),

      
      database.shared_notes.findAll({
        where: { to_user_id: req.user.user_id },
        include: [{
          model: database.notes,
          where: {
            [Op.or]: [
              { title: { [Op.iLike]: `%${req.query.q.trim()}%` } },
              { markdown_content: { [Op.iLike]: `%${req.query.q.trim()}%` } }
            ]
          },
          include: [{ model: database.subjects, attributes: ['name'] }]
        }],
        limit: 20
      })
    ])


    res.json({
      notes: notes.map(note => ({
        type: 'note',
        id: note.note_id,
        title: note.title,
        subject: note.Subject?.name,
        match: note.title.includes(req.query.q.trim()) ? 'title' : 'content'
      })),

      subjects: subjects.map(subject => ({
        type: 'subject', 
        id: subject.subject_id,
        name: subject.name
      })),

      tags: tags.map(tag => ({
        type: 'tag',
        id: tag.tag_id, 
        name: tag.name
      })),

      groups: groups.map(group => ({
        type: 'group',
        id: group.group_id,
        name: group.name,
        creator: group.creator?.name
      })),

      shared_notes: shared_notes.map(shared => ({
        type: 'shared_note',
        id: shared.share_id,
        title: shared.Note.title,
        subject: shared.Note.Subject?.name
      })),

    
    })

  } catch (error) {
    console.error("Eroare Cautare ! ", error)
    res.status(500).json({ error: 'Cautare esuata !' })
  }
})

module.exports = router