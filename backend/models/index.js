const database_configuration=require('../config/db.config.js')
const {Sequelize,DataTypes}=require('sequelize');
const sequelize=new Sequelize(database_configuration.DB,database_configuration.USER,database_configuration.PASSWORD,{
    host:database_configuration.HOST,
    dialect:database_configuration.dialect,
    pool:database_configuration.pool,
    dialectOptions:{
        allowPublicKeyRetrieval:true,
        ssl:false
    }
});
const database={};
database.Sequelize=Sequelize;
database.sequelize=sequelize;
database.users = require('./user.model.js')(sequelize, DataTypes);
database.subjects = require('./subject.model.js')(sequelize, DataTypes);
database.notes = require('./note.model.js')(sequelize, DataTypes);
database.tags = require('./tag.model.js')(sequelize, DataTypes);
database.notes_tags = require('./note_tag.model.js')(sequelize, DataTypes);
database.study_groups = require('./study_group.model.js')(sequelize, DataTypes);
database.group_members = require('./group_member.model.js')(sequelize, DataTypes);
database.group_notes = require('./group_note.model.js')(sequelize, DataTypes);
database.shared_notes = require('./shared_note.model.js')(sequelize, DataTypes);
database.attachments = require('./attachment.model.js')(sequelize, DataTypes);
database.external_resources = require('./external_resource.model.js')(sequelize, DataTypes);
database.badges = require('./badge.model.js')(sequelize, DataTypes);
database.user_badges = require('./user_badge.model.js')(sequelize, DataTypes);
//
database.users.hasMany(database.notes, { foreignKey: 'user_id' });
database.notes.belongsTo(database.users, { foreignKey: 'user_id' });
//
database.subjects.hasMany(database.notes, { foreignKey: 'subject_id' });
database.notes.belongsTo(database.subjects, { foreignKey: 'subject_id' });
//
database.notes.hasMany(database.attachments, { foreignKey: 'note_id' });
database.attachments.belongsTo(database.notes, { foreignKey: 'note_id' });
//
database.notes.hasMany(database.external_resources, { foreignKey: 'note_id' });
database.external_resources.belongsTo(database.notes, { foreignKey: 'note_id' });

// 
database.notes.belongsToMany(database.tags, {through: database.notes_tags,foreignKey: 'note_id',otherKey: 'tag_id'});
database.tags.belongsToMany(database.notes, {through: database.notes_tags,foreignKey: 'tag_id',otherKey: 'note_id'});
database.users.belongsToMany(database.study_groups, {through: database.group_members,foreignKey: 'user_id',otherKey: 'group_id'});
database.study_groups.belongsToMany(database.users, {through: database.group_members,foreignKey: 'group_id',otherKey: 'user_id'});
database.notes.belongsToMany(database.study_groups, {through: database.group_notes,foreignKey: 'note_id',otherKey: 'group_id'});
database.study_groups.belongsToMany(database.notes, {through: database.group_notes,foreignKey: 'group_id',otherKey: 'note_id'});
database.users.belongsToMany(database.notes, {through: database.shared_notes,foreignKey: 'to_user_id',otherKey: 'note_id',as: 'shared_notes_received'});
database.notes.belongsToMany(database.users, {through: database.shared_notes,foreignKey: 'note_id',otherKey: 'to_user_id',as: 'shared_with_users'});
database.users.belongsToMany(database.badges, {through: database.user_badges,foreignKey: 'user_id',otherKey: 'badge_id'});
database.badges.belongsToMany(database.users, {through: database.user_badges,foreignKey: 'badge_id',otherKey: 'user_id'});
database.study_groups.belongsTo(database.users, {foreignKey: 'created_by',as: 'creator'});
database.shared_notes.belongsTo(database.users, {foreignKey: 'from_user_id',as: 'shared_by_user'});
database.group_notes.belongsTo(database.users, {foreignKey: 'shared_by',as: 'shared_by_user'});

module.exports = database;