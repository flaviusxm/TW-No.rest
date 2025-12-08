const db = require('../models');
const Group = db.study_groups;
const Note = db.notes;

exports.create_group = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).send({ message: "Content can not be empty!" });
        }
        const group = await Group.create({
            name: req.body.name,
            created_by: req.user.id
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
            where: { id: id }
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

exports.get_group_notes = async (req, res) => {
    const id = req.params.id;
    try {
        const group = await Group.findByPk(id, {
            include: [{
                model: Note,
                through: { attributes: [] }
            }]
        });
        if (!group) {
            return res.status(404).send({ message: "Group not found" });
        }
        res.send(group.notes);
    } catch (err) {
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
        const count = await group.countNotes();
        res.send({ count: count });
    } catch (err) {
        res.status(500).send({ message: "Error retrieving count" });
    }
};