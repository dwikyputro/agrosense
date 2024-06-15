const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.login = async (request, h) => {
  const { username, password } = request.payload;

  // Validate username and password
  const user = await User.findOne({ username: username });
  if (!user || user.password !== password) {
    return h
      .response({ error: true, message: "Invalid credentials" })
      .code(401);
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    "your-secret-key",
    { expiresIn: "1h" }
  );

  return h
    .response({
      error: false,
      message: "success",
      loginResult: {
        userId: user._id,
        name: user.username, // assuming the name is stored in the username field
        token: token,
      },
    })
    .code(200);
};

exports.register = async (request, h) => {
  const { username, password } = request.payload;

  // Check if the username is already taken
  const existingUser = await User.findOne({ username: username });
  if (existingUser) {
    return h
      .response({ error: true, message: "Username already taken" })
      .code(409);
  }

  // Create a new user
  const user = new User({ username, password });
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    "your-secret-key",
    { expiresIn: "1h" }
  );

  return h
    .response({
      error: false,
      message: "User registered successfully",
      loginResult: {
        userId: user._id,
        name: user.username, // assuming the name is stored in the username field
        token: token,
      },
    })
    .code(201);
};
