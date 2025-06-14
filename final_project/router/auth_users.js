const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "user1", password: "1234" }];

const isValid = (username) => {
  return username !== "";
};

const authenticatedUser = (username, password) => {
  return !!users.find(
    (user) => user.username === username && user.password === password
  );
};

regd_users.post("/login", (req, res) => {
  // #swagger.tags = ['Authentication']
  const { username, password } = req.body;
  if (!authenticatedUser(username, password)) {
    return res.sendStatus(401);
  }

  const token = jwt.sign({ username }, "secret", { expiresIn: 60 * 60 });
  return res.status(200).json({ token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  // #swagger.tags = ['Review']
  // #swagger.description = 'Upsert a book review'
  const reviews = books[req.params.isbn].reviews;
  reviews[req.session.username] = req.body.review;
  return res.status(200).json(reviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // #swagger.tags = ['Review']
  // #swagger.description = 'Delete the book review'
  const reviews = books[req.params.isbn].reviews;
  delete reviews[req.session.username];
  return res.status(200).json(reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
