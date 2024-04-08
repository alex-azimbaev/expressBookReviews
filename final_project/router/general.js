const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (users[username]) {
      return res.status(400).json({message: "Username already exists"});
    } else {
      users[username] = password;
      return res.status(201).json({message: "User registered successfully"});
    }
  } else {
    return res.status(400).json({message: "Username or password not provided"});
  }
});

// Get the book list available in the shop
/*
public_users.get('/',function (req, res) {
  if (books) {
    return res.status(200).send(JSON.stringify(books, null, 2));
  } else {
    return res.status(404).json({message: "No books available in the shop"});
  }
});
*/

//Use Promise to get the book list available in the shop
public_users.get('/', (req, res) => {
  const getBooks = new Promise(resolve => resolve(res.status(200).json(books)));
  getBooks
  .then(() => console.log('Books list resolved'))
  .catch(() => console.log('Books list rejected'));
});

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn){
    let filtered_book = books[isbn];
    if (filtered_book) {
     return res.status(200).send(JSON.stringify(filtered_book, null, 2));
     } else {
         return res.status(404).json({message: "Book not found", isbn: isbn});
   } 
  } else {
  return res.status(400).json({message: "ISBN not provided"});
 }
});
*/

// Use Promise to get the book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const getBook = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      resolve(res.status(200).json(books[isbn]));
    } else {
      reject(res.status(404).json({ message: `The book is not found by ISBN: ${isbn}` }));
    }
  });
  getBook
    .then(() => console.log('Book details based on ISBN resolved'))
    .catch(() => console.log('Book details based on ISBN rejected'));
});
 
/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if (author){
    let filtered_books = [];
    const bookKeys = Object.keys(books);
    bookKeys.forEach((key) => {
      if (books[key].author === author) {
        filtered_books.push(books[key]);
      }
    });
    if (filtered_books.length > 0) {
      return res.status(200).send(JSON.stringify(filtered_books, null, 2));
    } else {
      return res.status(404).json({message: "No books found for the author", author: author});
    }
  } else { return res.status(400).json({message: "Author not provided"}); }
});
*/

// Use Promise to get the book details based on author
public_users.get('/author/:author', (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksOfAuthor = Object.values(books).filter(book => book.author === author);

    if (booksOfAuthor.length > 0) {
      resolve(res.status(200).json(booksOfAuthor));
    } else {
      reject(res.status(404).json({ message: `The books are not found by author: ${author}` }));
    }
  });
  getBooks
    .then(() => console.log('Books based on author resolved'))
    .catch(() => console.log('Books based on author rejected'));
});

/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if (title){
    let filtered_books = [];
    const bookKeys = Object.keys(books);
    bookKeys.forEach((key) => {
      if (books[key].title === title) {
        filtered_books.push(books[key]);
      }
    });
    if (filtered_books.length > 0) {
      return res.status(200).send(JSON.stringify(filtered_books, null, 2));
    } else {
      return res.status(404).json({message: "No books found for the title", title: title});
    }
  } else { return res.status(400).json({message: "Title not provided"}); }
});
*/

// Use Promise to get all books based on title
public_users.get('/title/:title', (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksWithTitle = Object.values(books).filter(book => book.title === title);

    if (booksWithTitle.length > 0) {
      resolve(res.status(200).json(booksWithTitle));
    } else {
      reject(res.status(404).json({ message: `The books are not found by title: ${title}` }));
    }
  });
  getBooks
    .then(() => console.log('Books based on title resolved'))
    .catch(() => console.log('Books based on title rejected'));
});

//  Get book reviews based on ISBN
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn){
    let filtered_book = books[isbn];
    if (filtered_book) {
     return res.status(200).send(JSON.stringify(filtered_book.reviews, null, 2));
     } else {
         return res.status(404).json({message: "Book not found", isbn: isbn});
   } 
  } else {
  return res.status(400).json({message: "ISBN not provided"});}
});


module.exports.general = public_users;
