const { Sequelize } = require("sequelize");
const { DataTypes } = Sequelize;
const db = require("../config/database");
const generateMD5 = require("../utils/generate-md5");
const User = require("./user-model");

const Report = db.define(
  "reports",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: () => generateMD5(),
      allowNull: false,
      primaryKey: true,
      validate: { notEmpty: true },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    patient_first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    patient_last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    patient_gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    patient_age: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    therapy_start_date: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    therapy_end_date: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    indication_common: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    indication_other: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
    total_dosing_per_cycle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    clinical_result: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    s_effects_mild: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
    s_effects_mild_desc: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
    s_effects_moderate: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
    s_effects_moderate_desc: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
    s_effects_severe: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
    s_effects_severe_desc: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { notEmpty: false },
    },
    md_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    md_clinic: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    md_phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    md_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    freezeTableName: true,
  }
);

User.hasMany(Report);
Report.belongsTo(User, { foreignKey: "userId" });

module.exports = Report;
