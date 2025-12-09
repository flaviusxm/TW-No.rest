const db = require('../models');
const Group = db.study_groups;
const Note = db.notes;

exports.create_group = async (req, res) => {
    try {
        if (!req.body.name) {return res.status(400).send({ message: "Content can not be empty!" });}
         if (!req.user) {return res.status(401).send({ message: "Userul nu este autentificat!" });}
        const group = await Group.create({
            name: req.body.name,
            created_by: req.user.user_id
        });
        res.send(group);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred." });
    }
};

exports.get_all_groups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.send(groups);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred." });
    }
};

exports.delete_group = async (req, res) => {
    const id = req.params.id;
    try {
        const num = await Group.destroy({
            where: { group_id: id }
        });
        if (num == 1) {
            res.send({ message: "Group was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Group with id=${id}. Maybe Group was not found!` });
        }
    } catch (err) {
        res.status(500).send({ message: "Could not delete Group with id=" + id });
    }
};

// controllers/groups_controller.js

exports.get_group_notes = async (req, res) => {
    const id = req.params.id; // Aici e definit "id"
    try {
        // GRESIT ERA: findByPk(group_id, ...) 
        // CORECT ESTE: findByPk(id, ...)
        const group = await Group.findByPk(id, { 
            include: [{
                model: Note,
                through: { attributes: [] }
            }]
        });
        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }
        // Sequelize returnează de obicei Notes cu litera mare daca nu e setat alias
        res.send(group.Notes || group.notes || []); 
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error retrieving Group notes" });
    }
};

exports.get_group_count = async (req, res) => {
    const id = req.params.id; 
    try {
        const group = await Group.findByPk(id); 

        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }
        if (group.countNotes) {
            const count = await group.countNotes();
            res.send({ count: count });
        } else {
            const count = await db.group_notes.count({ where: { group_id: id } });
            res.send({ count: count });
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error retrieving count" });
    }
};