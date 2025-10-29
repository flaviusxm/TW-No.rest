module.exports = (sequelize, DataTypes) => {
  const SharedNote = sequelize.define('SharedNote', {
    share_id: {
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
    from_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    to_user_id: {
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
    },
    permission: {
      type: DataTypes.ENUM('view', 'edit'),
      defaultValue: 'view'
    }
  }, {
    tableName: 'Shared_Notes',
    timestamps: false,
    underscored: true
  });

  return SharedNote;
};