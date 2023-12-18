const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  if (isValid(username, password)) {
    users[username] = password;
    console.log(users);
    return res.status(201).json({ message: "User created successfully" });
  } else {
    return res.status(409).json({ message: "User Already Exists" });
  }
});

// Get the book list available in the shop
 public_users.get("/", async function (req, res) {
  //Write your code here
  return res.status(200).json({ books: await books });
});
function getBookbyISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (!book) {
      reject({ message: "Book not found", status: 404 });
    } else {
      resolve(book);
    }
  });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  getBookbyISBN(req.params.isbn).then
  (book => res.status(200).json({ book: book }))
  .catch(err => res.status(err.status).json({ message: err.message }));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const listByAuthor = Object.values(books).filter(
    (book) => book.author === req.params.author
  );
  if (!listByAuthor) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json({ books_of_author: listByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const listByTitle = Object.values(books).filter(
    (book) => book.title === req.params.title
  );
  if (!listByTitle) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json({ books_by_title: listByTitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const bookReview = books[req.params.isbn].reviews;
  if (!bookReview) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json({ bookReview: bookReview });
});

module.exports.general = public_users;
