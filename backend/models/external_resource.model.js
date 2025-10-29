module.exports = (sequelize, DataTypes) => {
  const ExternalResource = sequelize.define('ExternalResource', {
    resource_id: {
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
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'External_Resources',
    timestamps: false,
    underscored: true
  });

  return ExternalResource;
};