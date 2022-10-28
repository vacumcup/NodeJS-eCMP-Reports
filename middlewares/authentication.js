const jwt = require("jsonwebtoken");

const ErrorResponse = require("../utils/error-response");
const User = require("../models/user-model");

// PROTECTED ROUTES
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new ErrorResponse("Not authorized to access this route", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await User.findOne({ where: { id: decoded.id } });
    next();
  } catch (error) {
    throw new ErrorResponse("Not authorized to access this route", 401);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse(`User with role: ${req.user.role} is not authorized to access this route`, 403);
    }
    next();
  };
};
