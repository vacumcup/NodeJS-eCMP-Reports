const { Sequelize } = require("sequelize");

const db = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  dialect: "mysql",
});

module.exports = db;
