const ErrorResponse = require("../utils/error-response");
const User = require("../models/user-model");

/**
 *  ### REGISTER USER
 *
 *  @method   POST
 *  @route    /api/v1/auth/register
 *  @access   public
 *
 *  @example
 *
 *  {
 *    "name": "John Doe",
 *    "email": "john@demo.com",
 *    "password": "demodemo",
 *    "confirmPassword": "demodemo"
 *  }
 *
 */

exports.registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email) {
    throw new ErrorResponse("Please provide name or email", 400);
  } else if (!password) {
    throw new ErrorResponse("Please provide password", 400);
  } else if (!confirmPassword) {
    throw new ErrorResponse("Please confirm password", 400);
  } else if (password !== confirmPassword) {
    throw new ErrorResponse("Password does not match", 400);
  }

  const user = await User.create(
    {
      name,
      email,
      password,
    },
    {
      individualHooks: true,
    }
  );

  sendTokenResponse(user, 200, res);
};

/**
 *  ### LOGIN USER
 *
 *  @method   POST
 *  @route    /api/v1/auth/login
 *  @access   public
 *
 *  @example
 *  {
 *    "email": "john@demo.com",
 *    "password": "demodemo",
 *  }
 *
 */

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorResponse("Please provide email or password", 400);
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ErrorResponse("User not found", 404);

  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) throw new ErrorResponse("Invalid email and password", 401);

  sendTokenResponse(user, 200, res);
};

/**
 *  ### LOGOUT USER
 *
 *  @method   GET
 *  @route    /api/v1/auth/logout
 *  @access   private
 *
 */

exports.logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "logout success" });
};

/**
 *  ### GET ME
 *
 *  @method   GET
 *  @route    /api/v1/auth/me
 *  @access   private
 *
 */

exports.getMe = async (req, res) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    // attributes: ["name", "email"],
  });

  sendTokenResponse(user, 200, res);

  // res.status(200).json({ success: true, user });
};

/**
 *  ### UPDATE ME
 *
 *  @method   PUT
 *  @route    /api/v1/auth/me
 *  @access   private
 *
 */

exports.updateMe = async (req, res) => {
  let user = await User.findOne({
    where: { id: req.user.id },
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
      individualHooks: true,
    }
  );

  user = await User.findOne({ where: { id: req.user.id } });

  res.status(200).json({ success: true, user });
};

/**
 *  ### GET TOKEN
 *
 *  @desc   Get token from model, create cookie and send response
 */

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getJwtToken(); // Create token

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") options.secure = true;

  res.status(statusCode).cookie("token", token, options).json({ success: true, token, user });
};
