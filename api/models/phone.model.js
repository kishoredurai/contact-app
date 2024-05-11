module.exports = (sequelize, DataTypes) => {
  const Phone = sequelize.define("Phone", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    number: {
      type: DataTypes.STRING,
    }
  });
  Phone.belongsTo(sequelize.models.Contact, {
    foreignKey: 'contactId',
    onDelete: 'CASCADE',
  });

  return Phone;
};

