module.exports = (sequelize, DataTypes) => {
  const UserBadge = sequelize.define('UserBadge', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    badge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'Badges',
        key: 'badge_id'
      }
    },
    earned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'User_Badges',
    timestamps: false,
    underscored: true
  });

  return UserBadge;
};