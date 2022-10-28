const ErrorResponse = require("../utils/error-response");
const User = require("../models/user-model");

/**
 *  ### GET ALL USERS
 *
 *  @method   GET
 *  @route    /api/v1/users
 *  @access   private admin
 *
 *  @example
 *  // URL/api/v1/users/
 *
 *  [
 *    // all users data
 *    // { ... }
 *  ]
 *
 */

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({ success: true, count: users.length, users });
};

/**
 *  ### GET SINGLE USER
 *
 *  @method   GET
 *  @route    /api/v1/users/:id
 *  @access   private admin
 *
 *  @param    {String} id User ID
 *  @example
 *  // URL/api/v1/users/1234567890
 *
 *  {
 *    "id": "1234567890",
 *     "name": "John Doe",
 *     "email": "john@demo.com",
 *     "password": "$2a$10$H1QaBWJqndK.GXTjL7MCF.BV94CdnrW8Eh9iPwZT8lOp7JnEYgp7W",
 *     "role": "user"
 *  }
 *
 */

exports.getSingleUser = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
  });

  if (!user) throw new ErrorResponse("User not found", 404);

  res.status(200).json({ success: true, user });
};

/**
 *  ### CREATE USER
 *
 *  @method   POST
 *  @route    /api/v1/reports
 *  @access   private admin
 *
 *  @example
 *  // URL/api/v1/users/
 *
 *  {
 *    "name": "Jane Doe",
 *    "email": "jane@demo.com",
 *    "password": "demodemo",
 *    "confirmPassword": "demodemo"
 *  }
 *
 */

exports.createUser = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    throw new ErrorResponse("Password does not match", 400);
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({ success: true, user });
};

/**
 *  ### UPDATE REPORT
 *
 *  @method   PUT
 *  @route    /api/v1/users/:id
 *  @access   private admin
 *
 *  @param    {String} id User ID
 *  @example
 *  // URL/api/v1/users/1234567890
 *
 *  {
 *    "name": "Update User",
 *    "email": "update_email@demo.com"
 *  }
 *
 */

exports.updateUser = async (req, res) => {
  let user = await User.findOne({
    where: { id: req.params.id },
  });

  if (!user) throw new ErrorResponse("User not found", 404);

  const { name, email, password, confirmPassword, role } = req.body;
  if (password !== confirmPassword) {
    throw new ErrorResponse("Password does not match", 400);
  }

  user = await User.update(
    {
      name: name || user.name,
      email: email || user.email,
      password: password || user.password,
      role: role || user.role,
    },
    {
      where: { id: user.id },
    }
  );

  user = await User.findOne({ where: { id: req.params.id } });

  res.status(200).json({ success: true, user });
};

/**
 *  ### DELETE REPORT
 *
 *  @method   DELETE
 *  @route    /api/v1/users/:id
 *  @access   private admin
 *
 *  @param    {String} id User ID
 *  @returns  \{} Empty object
 *
 */

exports.deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
  });

  if (!user) throw new ErrorResponse("User not found", 404);

  await User.destroy({
    where: { id: user.id },
  });

  res.status(200).json({ success: true, user: {} });
};
