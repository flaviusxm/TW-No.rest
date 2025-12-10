const database = require('../models');
const User = database.users;
const Op = database.Sequelize.Op;

exports.search_users = async (req, resp) => {
    try {
        if (!req.query.q || req.query.q.trim() === '') {
            console.log('Empty query returning []');
            return resp.json([]);
        }

        const searchTerm = `%${req.query.q.trim()}%`;
        console.log('Search Term:', searchTerm);

        const users = await User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: searchTerm } },
                    { email: { [Op.like]: searchTerm } }
                ]
            }, attributes: ['user_id', 'email', 'name']
        });

        console.log(`Found ${users.length} users`);
        resp.json(users);

    } catch (err) {
        console.error('Eroare la cautarea userilor:', err);
        resp.status(500).json({ err: 'Eroare server: ' + err.message });
    }
};


exports.get_user_badges = async (req, resp) => {
    try {
        const user_id = req.user.user_id;

        const user = await User.findByPk(user_id, {
            include: [{
                model: database.badges,
                through: { attributes: [] }
            }]
        });

        if (!user) {
            return resp.status(404).json({ error: 'User not found' });
        }

        resp.json(user.Badges);

    } catch (err) {
        console.error('Error fetching user badges:', err);
        resp.status(500).json({ err: 'Server error: ' + err.message });
    }
};
