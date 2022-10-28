const express = require("express");
const router = express.Router();

const { getAllReports, getSingleReport, createReport, updateReport, deleteReport } = require("../controllers/report-controllers");
const { protect } = require("../middlewares/authentication");

router.use(protect);

router.route("/").get(getAllReports).post(createReport);
router.route("/:id").get(getSingleReport).put(updateReport).delete(deleteReport);

module.exports = router;
