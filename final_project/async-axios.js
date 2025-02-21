const axios = require("axios");
const instance = axios.create({
  baseURL: "http:localhost:5000/",
});

async function getBookList() {
  try {
    const books = (await instance.get("/")).data;
    console.log(books);
  } catch (e) {
    console.error(e);
  }
}

async function getBookByISBN(isbn) {
  try {
    const book = (await instance.get(`/isbn/${isbn}`)).data;
    console.log(book);
  } catch (e) {
    console.log(e);
  }
}

async function getBooksByAuthor(author) {
  try {
    const books = (await instance.get(`/author/${author}`)).data;
    console.log(books);
  } catch (e) {
    console.log(e);
  }
}

async function getBooksByTitle(title) {
  try {
    const books = (await instance.get(`/title/${title}`)).data;
    console.log(books);
  } catch (e) {
    console.error(e);
  }
}

getBooksByTitle("Njál's Saga");
