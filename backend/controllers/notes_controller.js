const database = require('../models');
const fs = require('fs');
const path = require('path');
const Note = database.notes;
const Subject = database.subjects;
const Tag = database.tags;
const Attachment = database.attachments;

exports.create_note = async (req, resp) => {
    try {
        const { title, subject_id, description = '', tag_id } = req.body;

        if (!title || !title.trim() || !subject_id) {
            return resp.status(400).json({ err: 'Titlul și ID-ul subiectului sunt obligatorii' });
        }

        const subject = await Subject.findByPk(subject_id);
        if (!subject) {
            return resp.status(404).json({ err: 'Subiectul nu a fost gasit' });
        }

        const new_note = await Note.create({
            title: title.trim(),
            description: description.trim(),
            markdown_content: '',
            subject_id: subject_id,
            user_id: req.user.user_id,
            course_date: new Date().toISOString().split('T')[0]
        });

        let assignedTagName = null;
        if (tag_id) {
            const tag = await Tag.findByPk(tag_id);
            if (tag) {
                await new_note.setTags([tag_id]);
                assignedTagName = tag.name;
            }
        }

        resp.json({
            id: new_note.note_id,
            title: new_note.title,
            description: new_note.description || '',
            markdown_content: new_note.markdown_content,
            subject_id: new_note.subject_id,
            subject_name: subject.name,
            tag_id: tag_id || null,      // Returnam ID-ul
            tag_name: assignedTagName,   // Returnam Numele Tag-ului
            course_date: new_note.course_date,
            created_at: new_note.created_at,
            updated_at: new_note.updated_at,
            is_markdown: true
        });

    } catch (err) {
        console.error('Error creating note:', err);
        resp.status(500).json({ err: 'Eroare server: ' + err.message });
    }
};


exports.get_all_notes = async (req, resp) => {
    try {
        const notes = await Note.findAll({
            include: [
                {
                    model: Subject,
                    attributes: ['subject_id', 'name']
                },
                {
                    model: Tag,
                    through: { attributes: [] },
                    attributes: ['tag_id', 'name']
                }
            ],
            order: [['created_at', 'DESC']],
            where: { user_id: req.user.user_id }
        });

        const mapped_notes = notes.map(note => {
            const firstTag = note.Tags && note.Tags.length > 0 ? note.Tags[0] : null;

            return {
                id: note.note_id,
                title: note.title,
                description: note.description || '',
                content: note.markdown_content,
                subject_id: note.subject_id,
                subject_name: note.Subject ? note.Subject.name : null,
                tag_id: firstTag ? firstTag.tag_id : null,
                tag_name: firstTag ? firstTag.name : null,
                course_date: note.course_date,
                created_at: note.created_at,
                updated_at: note.updated_at,
                is_markdown: true
            };
        });

        resp.json(mapped_notes);

    } catch (err) {
        console.error('Eroare la obtinerea notitelor:', err);
        resp.status(500).json({ err: err.message });
    }
};

exports.get_note_by_id = async (req, resp) => {
    try {
        const note = await Note.findByPk(req.params.id, {
            include: [
                {
                    model: Subject,
                    attributes: ["subject_id", "name"]
                },
                {
                    model: Tag,
                    through: { attributes: [] },
                    attributes: ['tag_id', 'name']
                },
                {
                    model: Attachment
                }
            ]
        });

        if (!note) {
            return resp.status(404).json({ err: 'Notita nu a fost gasita' });
        }

        if (note.user_id !== req.user.user_id) {
            return resp.status(403).json({ err: 'Nu ai acces la această notiță' });
        }

        const firstTag = note.Tags && note.Tags.length > 0 ? note.Tags[0] : null;

        resp.json({
            id: note.note_id,
            title: note.title,
            description: note.description || '',
            markdown_content: note.markdown_content || '',
            subject_id: note.subject_id,
            subject_name: note.Subject?.name || null,
            tag_id: firstTag ? firstTag.tag_id : null,
            tag_name: firstTag ? firstTag.name : null,
            course_date: note.course_date,
            created_at: note.created_at,
            updated_at: note.updated_at,
            attachments: note.Attachments || [],
            is_markdown: true
        });
    } catch (err) {
        console.error('Error getting note by id:', err);
        resp.status(500).json({ err: err.message });
    }
};


exports.update_note = async (req, resp) => {
    try {
        const { title, description, content, subject_id, course_date, tag_id } = req.body;
        const note = await Note.findByPk(req.params.id);
        if (!note) { return resp.status(404).json({ err: 'Notita nu a fost gasita!' }); }
        if (title !== undefined) note.title = title.trim();
        if (description !== undefined) note.description = description.trim();
        if (content !== undefined) { note.markdown_content = content ? content.trim() : ''; }
        if (subject_id !== undefined) note.subject_id = subject_id;
        if (course_date !== undefined) {
            note.course_date = course_date === "" ? null : course_date;
        }

        await note.save();

        let tagName = null;
        if (tag_id !== undefined) {
            if (!tag_id) {
                await note.setTags([]);
            } else {
                const tag = await Tag.findByPk(tag_id);
                if (tag) {
                    await note.setTags([tag_id]);
                    tagName = tag.name;
                }
            }
        } else {
            const currentTags = await note.getTags();
            if (currentTags.length > 0) {
                tagName = currentTags[0].name;
            }
        }

        let subjectName = null;
        try {
            const subj = await Subject.findByPk(note.subject_id);
            subjectName = subj?.name || null;
        } catch (err) { }

        resp.json({
            id: note.note_id,
            title: note.title,
            description: note.description || '',
            markdown_content: note.markdown_content,
            subject_id: note.subject_id,
            subject_name: subjectName,
            tag_id: tag_id || null,
            tag_name: tagName,
            course_date: note.course_date,
            updated_at: note.updated_at,
            is_markdown: true
        });

    } catch (err) {
        console.error('Error updating note:', err);
        return resp.status(400).json({ err: 'Eroare update notita: ' + err.message });
    }
};

exports.upload_attachment = async (req, resp) => {

    try {
        if (!req.file) { return resp.status(400).json({ err: 'Error file upload' }) }

        const note_id = req.params.id;
        const attachment_url = `http://localhost:5019/uploads/${req.file.filename}`;
        const attachment = await Attachment.create({
            note_id: note_id,
            file_url: attachment_url,
            file_type: req.file.mimetype,
            uploaded_at: new Date()
        })
        resp.json(attachment);

    } catch (err) {
        console.error('Upload error', err);
        resp.status(500).json({ err: err.message })
    }
}


exports.delete_attachment = async (req, resp) => {
    try {
        const attachmentId = req.params.attachmentId;
        const attachment = await Attachment.findByPk(attachmentId);

        if (!attachment) {
            return resp.status(404).json({ err: 'Atasament inexistent.' });
        }

        // Optional: Check if user owns the note for this attachment
        const note = await Note.findByPk(attachment.note_id);
        if (!note || note.user_id !== req.user.user_id) {
            return resp.status(403).json({ err: 'Nu ai dreptul sa stergi acest fisier.' });
        }

        // Delete file from system
        if (attachment.file_url) {

            const parts = attachment.file_url.split('/uploads/');
            if (parts.length > 1) {
                const filename = parts[1];
                const filePath = path.join(__dirname, '..', 'uploads', filename);
                if (fs.existsSync(filePath)) {
                    try { fs.unlinkSync(filePath); } catch (e) { console.error("Error deleting file", e); }
                }
            }
        }

        await attachment.destroy();
        resp.json({ message: 'Atasament sters.' });

    } catch (err) {
        console.error('Error delete attachment:', err);
        resp.status(500).json({ err: err.message });
    }
}

exports.delete_note = async (req, resp) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) {
            return resp.status(404).json({ err: 'Notita nu a fost gasita' });
        }
        await note.destroy();
        resp.json({ message: 'Notita stearsa cu succes !' });
    } catch (err) {
        console.error('Error deleting note:', err);
        resp.status(500).json({ err: err.message });
    }
};