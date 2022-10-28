const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/database");
const generateMD5 = require("../utils/generate-md5");

const User = db.define(
  "users",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => generateMD5(),
      allowNull: false,
      primaryKey: true,
      validate: { notEmpty: true },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [3, 100] },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, isEmail: true },
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    freezeTableName: true,
  }
);

User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = User;
