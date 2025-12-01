module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    attachment_id: {
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
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Attachments',
    timestamps: false,
    underscored: true
  });

  return Attachment;
};