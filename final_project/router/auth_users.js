const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const e = require('express');
const regd_users = express.Router();

let users = [];


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, "access", (err, user) => {
    if (err) {
      return res.status(403).send('Forbidden');
    }
    req.user = user; // Set the user in the request object
    next(); // Pass the execution off to whatever request the client intended
  });
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {  
    const user_password = users[username];
    console.log(username, password, user_password);
    if (users[username] && user_password === password) {
      const accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });
      req.session.authorization = {
        access_token: accessToken
      };
      return res.status(200).json({message: "User logged in successfully", access_token: accessToken});
    } else {
      return res.status(403).json({message: "Invalid username or password"});
    }
  } else {
    return res.status(400).json({message: "Username and password are required"});
  }
});

// Add a book review 
regd_users.put("/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username

  if (isbn && review && username) {
    let book = books[isbn];
    if (book) {
      if (book.reviews[username]) {
        book.reviews[username] = review;
        return res.status(200).json({message: "Review updated successfully", book: book});
      } else {
        book.reviews[username] = review;
        return res.status(200).json({message: "Review added successfully", book: book});
      }
    } else { 
      return res.status(404).json({message: "Book not found", isbn: isbn});
    } 
  } else {
    return res.status(400).json({message: "ISBN, review or username not provided"});
  }
});

regd_users.delete("/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (isbn && username) {
    let book = books[isbn];
    if (book) {
      if (book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({message: "Review deleted successfully", book: book});
      } else {
        return res.status(404).json({message: "Review not found", isbn: isbn});
      }
    } else {
      return res.status(404).json({message: "Book not found", isbn: isbn});
    }
  } else {
    return res.status(400).json({message: "ISBN or username not provided"});
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
