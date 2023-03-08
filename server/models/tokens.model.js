const Sequelize = require("sequelize");
const sequelize = require("../sequelize-object");

const Token = sequelize.define("token", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
});

module.exports = Token;
