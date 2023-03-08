const Sequelize = require("sequelize");
const useBcrypt = require("sequelize-bcrypt");
const sequelize = require("../sequelize-object");
const bcryptOptions = require("../bcrypt-options");
const Task = require("./tasks.model");

const User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

useBcrypt(User, bcryptOptions);

module.exports = User;
