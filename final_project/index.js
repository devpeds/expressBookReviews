const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");

const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization.split("Bearer ")[1];

  try {
    const { username } = jwt.verify(token, "secret");
    req.session.username = username;
    next();
  } catch (e) {
    console.error(e);
    return res.sendStatus(401);
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(require("./swagger-output.json"))
);

app.listen(PORT, () => console.log("Server is running"));
