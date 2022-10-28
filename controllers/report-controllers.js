const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const ErrorResponse = require("../utils/error-response");
const Report = require("../models/report-model");
const User = require("../models/user-model");

/**
 *  ### GET ALL REPORTS
 *
 *  @method   GET
 *  @route    /api/v1/reports
 *  @access   private user or admin
 *
 *  @example
 *  // URL/api/v1/reports/
 *
 *  [
 *    // all reports data
 *    // { ... }
 *  ]
 *
 */

exports.getAllReports = async (req, res) => {
  const { search } = req.query;

  const isAdmin = req.user.role === "admin" ? null : { userId: req.user.id };

  const searchQuery = search ? [{ brand: { [Op.like]: "%" + search + "%" } }] : [];
  const searchSQL = { [Op.and]: searchQuery };

  const reports = await Report.findAll({
    where: Object.assign(searchSQL, isAdmin),
    include: [{ model: User, attributes: ["name", "email"] }],
  });

  res.status(200).json({ success: true, count: reports.length, reports });
};

/**
 *  ### GET SINGLE REPORT
 *
 *  @method   GET
 *  @route    /api/v1/reports/:id
 *  @access   private user or admin
 *
 *  @param    {String} id Report ID
 *  @example
 *  // URL/api/v1/reports/1234567890
 *
 *  {
 *    "id": "1234567890",
 *    // report detail
 *    // ...
 *    "user": {
 *      "name": "admin",
 *      "email": "admin@demo.com"
 *    }
 *  }
 *
 */

exports.getSingleReport = async (req, res) => {
  const isAdmin = req.user.role === "admin" ? { id: req.params.id } : { id: req.params.id, userId: req.user.id };

  const report = await Report.findOne({
    where: isAdmin,
    include: [{ model: User, attributes: ["name", "email"] }],
  });

  if (!report) throw new ErrorResponse("Report not found", 404);

  res.status(200).json({ success: true, report });
};

/**
 *  ### CREATE NEW REPORT
 *
 *  @method   POST
 *  @route    /api/v1/reports
 *  @access   private user or admin
 *
 *  @example
 *  // URL/api/v1/reports/
 *
 *  {
 *    "first_name": "John",
 *    "last_name": "Doe",
 *    "age": "45",
 *    "indication": "Brain",
 *    // ... etc
 *  }
 *
 */

exports.createReport = async (req, res) => {
  // const isAdminID = req.user.role === "admin" ? req.body.userId : req.user.id;
  req.body.userId = req.user.id;

  const report = await Report.create(req.body);
  res.status(201).json({ success: true, report });
};

/**
 *  ### UPDATE REPORT
 *
 *  @method   PUT
 *  @route    /api/v1/reports/:id
 *  @access   private user or admin
 *
 *  @param    {String} id Report ID
 *  @example
 *  // URL/api/v1/reports/1234567890
 *
 *  {
 *    "first_name": "Jane",
 *    "indication": "Other",
 *    // ... etc
 *  }
 *
 */

exports.updateReport = async (req, res) => {
  const isAdmin = req.user.role === "admin" ? { id: req.params.id } : { id: req.params.id, userId: req.user.id };

  let report = await Report.findOne({ where: isAdmin });
  if (!report) throw new ErrorResponse("Report not found", 404);

  const isAdminID = req.user.role === "admin" ? req.body.userId : req.user.id;
  req.body.userId = isAdminID;

  report = await Report.update(req.body, {
    where: isAdmin,
  });

  report = await Report.findOne({ where: isAdmin });

  res.status(200).json({ success: true, report });
};

/**
 * @desc    DELETE REPORT
 * @route   DELETE /api/v1/reports/:id
 * @access  private user || admin
 */

/**
 *  ### DELETE REPORT
 *
 *  @method   DELETE
 *  @route    /api/v1/reports/:id
 *  @access   private user or admin
 *
 *  @param    {String} id Report ID
 *  @returns  \{} Empty object
 *
 */

exports.deleteReport = async (req, res) => {
  const isAdmin = req.user.role === "admin" ? { id: req.params.id } : { id: req.params.id, userId: req.user.id };

  let report = await Report.findOne({ where: isAdmin });
  if (!report) throw new ErrorResponse("Report not found", 404);

  await Report.destroy({
    where: isAdmin,
  });

  res.status(200).json({ success: true, report: {} });
};
