module.exports = (sequelize, DataTypes) => {
  const GroupNote = sequelize.define('GroupNote', {
    group_note_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    note_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Notes',
        key: 'note_id'
      }
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Study_Groups',
        key: 'group_id'
      }
    },
    shared_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    shared_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Group_Notes',
    timestamps: false,
    underscored: true
  });

  return GroupNote;
};