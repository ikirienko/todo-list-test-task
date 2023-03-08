const Sequelize = require("sequelize");
const sequelize = require("../sequelize-object");

const Task = sequelize.define("task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  done: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  textIsEdited: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Task;
