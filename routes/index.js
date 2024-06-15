const userHandler = require("../handlers/userHandler");

module.exports = [
  {
    method: "POST",
    path: "/login",
    handler: userHandler.login,
    options: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/register",
    handler: userHandler.register,
    options: {
      auth: false,
    },
  },
];
