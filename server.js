require("colors");
require("dotenv").config();
require("express-async-errors");

// EXPRESS
const express = require("express");
const app = express();
app.use(express.json());

// DATABASE
const db = require("./config/database");
(async () => await db.sync())();
db.sync();

// SUPPORT LIBRARY
const cors = require("cors");
app.use(cors());
const morgan = require("morgan");
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ROUTES
const AuthRoutes = require("./routes/auth-routes");
app.use("/api/v1/auth", AuthRoutes);
const ReportRoutes = require("./routes/report-routes");
app.use("/api/v1/reports", ReportRoutes);
const UserRoutes = require("./routes/user-routes");
app.use("/api/v1/users", UserRoutes);

// ERROR MIDDLEWARE
const notFoundMiddleware = require("./middlewares/not-found");
app.use(notFoundMiddleware);
const errorHandlerMiddleware = require("./middlewares/error-handler");
app.use(errorHandlerMiddleware);

// CONNECTION
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listerning in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow);
});
