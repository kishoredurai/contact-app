module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define("Contact", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }); 
    return Contact;
  };
  