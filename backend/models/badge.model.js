module.exports = (sequelize, DataTypes) => {
  const Badge = sequelize.define('Badge', {
    badge_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    condition: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    icon_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'Badges',
    timestamps: false,
    underscored: true
  });

  return Badge;
};