const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if(users[username]) return false;
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if(users[username] === password) return true;
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(authenticatedUser(username,password)){
    const accessToken = jwt.sign({data: password},  'access', { expiresIn: 60 });
    req.session.authorization = {
      accessToken,username
  }
    return res.status(200).json({message:"successful login" });
  }
  return res.status(300).json({message: "user not authenticated"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const  {user,reviewText}  = req.body;
  console.log(user);
  console.log(reviewText);
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  books[isbn].reviews[user] = reviewText;
  return res.status(200).json({ message: "Review updated successfully" });

});
regd_users.delete("/auth/review/:isbn", (req, res) => { //delete a book review
  //Write your code here
  const isbn = req.params.isbn;
  const  {user}  = req.body;
  console.log(user);
  
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  books[isbn].reviews[user] = {};
  return res.status(200).json({ message: "Review deleted successfully" });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
