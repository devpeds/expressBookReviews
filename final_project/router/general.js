const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // #swagger.tags = ['Authentication']
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({
      message: "Both username and password must be provided",
    });
  }

  if (!isValid(username)) {
    return res.status(400).send({ message: "Username is not valid" });
  }

  if (users.find((user) => user.username === username)) {
    return res
      .status(409)
      .send({ message: `${username} is already registered` });
  }

  users.push({ username, password });
  return res
    .status(200)
    .json({ message: `${username} is registered successfully` });
});

public_users.get("/", async function (req, res) {
  // #swagger.tags = ['Book']
  // #swagger.description = 'Get the book list available in the shop'
  try {
    const bookList = Object.values(await books);
    return res.status(200).json({ books: bookList });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

public_users.get("/isbn/:isbn", async function (req, res) {
  // #swagger.tags = ['Book']
  // #swagger.description = 'Get book details based on ISBN'
  try {
    const book = (await books)[req.params.isbn];
    if (!book) {
      return res.sendStatus(404);
    }

    return res.status(200).json(book);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

public_users.get("/author/:author", async function (req, res) {
  // #swagger.tags = ['Book']
  // #swagger.description = 'Get book details based on author'
  try {
    const booksByAuthor = Object.values(await books).filter(
      (b) => b.author === req.params.author
    );

    return res.status(200).json({ books: booksByAuthor });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

public_users.get("/title/:title", async function (req, res) {
  // #swagger.tags = ['Book']
  // #swagger.description = 'Get all books based on title'
  try {
    const booksByTitle = Object.values(books).filter(
      (b) => b.title === req.params.title
    );

    return res.status(200).json({ books: booksByTitle });
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
});

public_users.get("/review/:isbn", function (req, res) {
  // #swagger.tags = ['Review']
  // #swagger.description = 'Get book reviews'
  const book = books[req.params.isbn];
  if (!book) {
    return res.sendStatus(404);
  }

  const review = book.reviews;
  return res.status(200).json({ review });
});

module.exports.general = public_users;
