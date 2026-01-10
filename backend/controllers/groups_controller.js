const db = require('../models');
const Group = db.study_groups;
const Note = db.notes;
const User = db.users;
const GroupNote = db.group_notes;

// --- CREATE GROUP ---
exports.create_group = async (req, res) => {
    try {
        if (!req.body.name) return res.status(400).send({ message: "Name required" });
        const group = await Group.create({
            name: req.body.name,
            created_by: req.user.user_id
        });
        try {
            if (group.addUser) await group.addUser(req.user.user_id);
        } catch (e) { console.log("Auto-add warning:", e.message); }
        res.send(group);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// --- GET ALL GROUPS ---
exports.get_all_groups = async (req, res) => {
    try {
        const groups = await Group.findAll();
        res.send(groups);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// --- DELETE GROUP ---
exports.delete_group = async (req, res) => {
    try {
        await Group.destroy({ where: { group_id: req.params.id } });
        res.send({ message: "Group deleted" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// --- GET MEMBERS ---
exports.get_group_members = async (req, res) => {
    const id = req.params.id;
    try {
        const group = await Group.findByPk(id, {
            include: [{
                model: User,
                attributes: ['user_id', 'name', 'email'],
                through: { attributes: [] }
            }]
        });
        if (!group) return res.status(404).send({ message: "Group not found" });

        const members = group.Users || group.users || [];
        console.log(`[GET_GROUP_MEMBERS] Group ${id} has ${members.length} members.`);
        res.send(members);
    } catch (err) {
        console.error("Get Members Error:", err);
        res.status(500).send({ message: "Error fetching members" });
    }
};

// --- GET NOTES ---
exports.get_group_notes = async (req, res) => {
    const id = req.params.id;
    try {
        const group = await Group.findByPk(id, {
            include: [{
                model: Note,

                through: { attributes: [] }
            }]
        });

        if (!group) return res.status(404).send({ message: "Group not found" });

        const notes = group.Notes || group.notes || [];
        console.log(`[GET_GROUP_NOTES] Group ${id} has ${notes.length} notes.`);


        res.send(notes);
    } catch (err) {
        console.error("Get Group Notes Error:", err);
        res.status(500).send({ message: "Error fetching notes" });
    }
};

// --- GET COUNT ---
exports.get_group_count = async (req, res) => {
    const id = req.params.id;
    try {
        const notesCount = db.group_notes ? await db.group_notes.count({ where: { group_id: id } }) : 0;
        const membersCount = db.group_members ? await db.group_members.count({ where: { group_id: id } }) : 0;
        res.send({ notes_count: notesCount, members_count: membersCount });
    } catch (err) {
        res.status(500).send({ message: "Error counting" });
    }
};

// --- ADD MEMBER ---
exports.add_member = async (req, res) => {
    const groupId = req.params.id;
    const userId = req.body.userId;
    console.log(`[ADD_MEMBER] Adding user ${userId} to group ${groupId}`);
    try {
        const group = await Group.findByPk(groupId);
        if (!group) return res.status(404).send({ message: "Group not found" });

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).send({ message: "User not found" });

        // Check duplicate
        if (group.hasUser) {
            const has = await group.hasUser(user);
            if (has) {
                console.log(`[ADD_MEMBER] User ${userId} already in group ${groupId}`);
                return res.status(400).send({ message: "User already in group" });
            }
        }

        if (group.addUser) await group.addUser(user);
        else if (db.group_members) await db.group_members.create({ group_id: groupId, user_id: userId });

        console.log(`[ADD_MEMBER] Success`);
        res.send({ message: "Member added" });
    } catch (err) {
        console.error("[ADD_MEMBER] Error:", err);
        res.status(500).send({ message: "Could not add member: " + err.message });
    }
};

// --- ADD NOTE ---
exports.add_note = async (req, res) => {
    const groupId = req.params.id;
    const noteId = req.body.noteId;
    const currentUserId = req.user ? req.user.user_id : null;

    console.log(`[ADD_NOTE] Adding note ${noteId} to group ${groupId} by user ${currentUserId}`);

    if (!groupId || !noteId) return res.status(400).send({ message: "Missing IDs" });
    if (!currentUserId) return res.status(401).send({ message: "Unauthorized" });

    try {
        const note = await Note.findByPk(noteId);
        if (!note) return res.status(404).send({ message: "Note not found" });

        const existing = await GroupNote.findOne({ where: { group_id: groupId, note_id: noteId } });
        if (existing) return res.status(400).send({ message: "Note exists in group" });

        await GroupNote.create({
            group_id: groupId,
            note_id: noteId,
            shared_by: currentUserId
        });
        console.log(`[ADD_NOTE] Success`);
        res.send({ message: "Note shared!" });
    } catch (err) {
        console.error("[ADD_NOTE] Error:", err);
        res.status(500).send({ message: err.message });
    }
};