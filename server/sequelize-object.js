const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DEV_DATABASE_URL, {
  dialect: "postgres",
  host: "localhost",
  protocol: "postgres",
  dialectOptions: {},
});

module.exports = sequelize;
