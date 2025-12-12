const database = require("../models");
const { Op } = require("sequelize");

const note = database.notes;
const tag = database.tags;
const subject = database.subjects;
const study_group = database.study_groups;
const attachment = database.attachments; 
const badge = database.badges; 
const user_badge = database.user_badges;
const shared_note = database.shared_notes;
const user = database.users;

const count_markdown_content_words = (str) => {
    if (!str) return 0;
    return str.trim().split(/\s+/).length;
};

const calculate_days_streak = (dates) => {
    if (!dates || dates.length === 0) return 0;
    
    const unique_dates = [...new Set(dates.map(d => new Date(d).toISOString().split('T')[0]))].sort();

    let max_streak = 1;
    let current_streak = 1;

    for (let i = 1; i < unique_dates.length; i++) {
        const prev = new Date(unique_dates[i-1]);
        const curr = new Date(unique_dates[i]);
        
        const difference_time = Math.abs(curr - prev);
        const difference_days = Math.ceil(difference_time / (1000 * 60 * 60 * 24)); 

        if (difference_days === 1) {
            current_streak++;
        } else {
            max_streak = Math.max(max_streak, current_streak);
            current_streak = 1;
        }
    }
    return Math.max(max_streak, current_streak);
};

exports.get_achievements = async (req, res) => {
    const user_id = req.user ? req.user.user_id : null; 

    if (!user_id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // 2. Fetch Data (folosind modelele definite sus)
        const user_notes = await note.findAll({
            where: { user_id: user_id },
            include: [
                { model: attachment },
                { model: tag }, 
                { model: subject }
            ]
        });

        const created_groups = await study_group.findAll({
            where: { created_by: user_id },
            include: [{ model: user }] 
        });

        const shared_notes_count = await shared_note.count({ where: { from_user_id: user_id } });
        const earned_badges = await user_badge.findAll({ where: { user_id: user_id } });
        const all_badges = await badge.findAll();

        const earned_badge_ids = new Set(earned_badges.map(ub => ub.badge_id));

        // 3. Calcul Statistici (snake_case)
        const total_notes = user_notes.length;
        const total_words = user_notes.reduce((acc, n) => acc + count_markdown_content_words(n.markdown_content), 0);
        
        // Streak
        const creation_dates = user_notes.map(n => n.created_at);
        const streak_days = calculate_days_streak(creation_dates);

        // Subiecte
        const distinct_subject_ids = new Set(user_notes.map(n => n.subject_id));
        const distinct_subjects_count = distinct_subject_ids.size;

        // Tag-uri
        const distinct_tag_ids = new Set();
        const notes_per_tag = {}; 
        
        user_notes.forEach(n => {
            if (n.Tags && n.Tags.length > 0) {
                n.Tags.forEach(t => {
                    distinct_tag_ids.add(t.tag_id);
                    notes_per_tag[t.tag_id] = (notes_per_tag[t.tag_id] || 0) + 1;
                });
            }
        });
        const distinct_tags_count = distinct_tag_ids.size;
        const max_notes_for_single_tag = Math.max(0, ...Object.values(notes_per_tag));

        // Multimedia Stats
        let stats_markdown_content = { attachments: 0, images: 0, videos: 0, pdfs: 0 };
        user_notes.forEach(n => {
            if (n.Attachments) {
                stats_markdown_content.attachments += n.Attachments.length;
                n.Attachments.forEach(att => {
                    const type = att.file_type.toLowerCase();
                    if (type.includes('image')) stats_markdown_content.images++;
                    if (type.includes('video')) stats_markdown_content.videos++;
                    if (type.includes('pdf')) stats_markdown_content.pdfs++;
                });
            }
        });

        // 4. Verificare Badge-uri
        const badge_status_list = [];
        let new_unlock = false;

        for (const b of all_badges) {
            let is_unlocked = earned_badge_ids.has(b.badge_id);
            let condition_met = false;

            // Switch cu variabile snake_case
            switch(b.name) {
                case 'Rookie':
                    condition_met = total_notes >= 10;
                    break;
                case 'Scribe':
                    condition_met = total_notes >= 50;
                    break;
                case 'Scholar':
                    condition_met = total_notes >= 100;
                    break;
                case 'Wordsmith':
                    condition_met = total_words >= 10000;
                    break;
                case 'Novel Writer':
                    condition_met = total_words >= 50000;
                    break;
                case 'The Architect': 
                    condition_met = user_notes.some(n => count_markdown_content_words(n.markdown_content) >= 2000);
                    break;
                case 'Minimalist':
                    condition_met = user_notes.some(n => n.title && (!n.markdown_content || n.markdown_content.trim() === ''));
                    break;
                case 'Daily Chronicler':
                    condition_met = streak_days >= 7;
                    break;
                case 'Marathon Runner':
                    condition_met = streak_days >= 30;
                    break;
                case 'Time Traveler':
                    condition_met = user_notes.some(n => n.course_date && new Date(n.course_date) > new Date());
                    break;
                case 'Night Owl':
                    const night_notes = user_notes.filter(n => {
                        const h = new Date(n.created_at).getHours();
                        return h >= 0 && h < 5;
                    });
                    condition_met = night_notes.length >= 5;
                    break;
                case 'Early Bird':
                    const morning_notes = user_notes.filter(n => {
                        const h = new Date(n.created_at).getHours();
                        return h >= 5 && h < 8;
                    });
                    condition_met = morning_notes.length >= 5;
                    break;
                case 'The Pioneer':
                    condition_met = distinct_subjects_count >= 1;
                    break;
                case 'Polymath':
                    condition_met = distinct_subjects_count >= 10;
                    break;
                case 'Deep Diver':
                    const notes_per_subject = {};
                    user_notes.forEach(n => notes_per_subject[n.subject_id] = (notes_per_subject[n.subject_id] || 0) + 1);
                    const max_subject_notes = Math.max(0, ...Object.values(notes_per_subject));
                    condition_met = max_subject_notes >= 30;
                    break;
                case 'The Tagger':
                    condition_met = distinct_tags_count >= 20;
                    break;
                case 'The Connector':
                    condition_met = max_notes_for_single_tag >= 5;
                    break;
                case 'Resource Gatherer':
                    condition_met = stats_markdown_content.attachments >= 50;
                    break;
                case 'Visual Learner':
                    condition_met = stats_markdown_content.images >= 10;
                    break;
                case 'The Streamer':
                    condition_met = stats_markdown_content.videos >= 10;
                    break;
                case 'Researcher':
                    condition_met = stats_markdown_content.pdfs >= 10;
                    break;
                case 'Multimedia Master':
                    condition_met = user_notes.some(n => {
                        if (!n.Attachments) return false;
                        const types = n.Attachments.map(a => a.file_type.toLowerCase());
                        return types.some(t => t.includes('image')) && 
                               types.some(t => t.includes('video')) && 
                               types.some(t => t.includes('pdf'));
                    });
                    break;
                case 'The Founder':
                    condition_met = created_groups.length >= 1;
                    break;
                case 'Community Leader':
                    condition_met = created_groups.length >= 5;
                    break;
                case 'Squad Goals':
                    condition_met = created_groups.some(g => g.Users && g.Users.length >= 10);
                    break;
                case 'Open Source':
                    condition_met = shared_notes_count >= 10;
                    break;
                case 'Full Stack':
                    condition_met = distinct_subjects_count >= 1 && 
                                    distinct_tags_count >= 1 && 
                                    total_notes >= 1 && 
                                    created_groups.length >= 1;
                    break;
                case 'The Perfectionist':
                    condition_met = false; 
                    break;
                case 'Spring Cleaner':
                    condition_met = false;
                    break;
                default:
                    condition_met = false;
            }

            // Deblocare si Data
            let earned_date = null;

            if (!is_unlocked && condition_met) {
                await user_badge.create({
                    user_id: user_id,
                    badge_id: b.badge_id,
                    earned_at: new Date()
                });
                is_unlocked = true;
                new_unlock = true; 
                earned_date = new Date();
            } else if (is_unlocked) {
                const existing = earned_badges.find(eb => eb.badge_id === b.badge_id);
                earned_date = existing ? existing.earned_at : new Date();
            }

            const frontend_id = b.name.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');

            badge_status_list.push({
                id: frontend_id,
                title: b.name,
                description: b.description || b.condition,
                unlocked: is_unlocked,
                date: earned_date
            });
        }

        // 5. Infinity Gauntlet Logic (snake_case)
        const infinity_badge_db = all_badges.find(b => b.name === 'Infinity Gauntlet');
        
        if (infinity_badge_db) {
            const infinity_frontend_id = 'infinity_gauntlet';
            const infinity_index = badge_status_list.findIndex(b => b.id === infinity_frontend_id);
            let has_infinity = earned_badge_ids.has(infinity_badge_db.badge_id);

            if (!has_infinity) {
                const unlocked_count = badge_status_list.filter(b => b.unlocked && b.id !== infinity_frontend_id).length;
                const total_other_badges = all_badges.length - 1; 

                if (unlocked_count >= total_other_badges) {
                    await user_badge.create({
                        user_id: user_id,
                        badge_id: infinity_badge_db.badge_id,
                        earned_at: new Date()
                    });
                    
                    if (infinity_index !== -1) {
                        badge_status_list[infinity_index].unlocked = true;
                        badge_status_list[infinity_index].date = new Date();
                    }
                }
            }
        }

        res.status(200).json(badge_status_list);

    } catch (err) {
        console.error('Error', err);
        res.status(500).json({ msg: 'Server error' });
    }
};