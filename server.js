const Hapi = require("@hapi/hapi");
const mongoose = require("mongoose");
const databaseConfig = require("./config/database");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost", // Ensure the server listens on all network interfaces
  });

  await server.register(require("@hapi/basic"));

  // Database connection
  mongoose.connect(databaseConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Route registration
  const routes = require("./routes");
  server.route(routes);

  // Authentication strategy
  const validate = async (request, username, password, h) => {
    // Validate username and password
    const user = await User.findOne({ username: username });
    if (!user || user.password !== password) {
      return { isValid: false };
    }
    return { isValid: true, credentials: { user: user } };
  };

  server.auth.strategy("simple", "basic", { validate });
  server.auth.default("simple");

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
