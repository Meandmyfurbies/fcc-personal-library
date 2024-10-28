/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require("mongoose");
require("dotenv").config;
mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true});
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: Number,
  comments: [String]
});
const Book = mongoose.model("Book", bookSchema);
module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const booksDocs = await Book.find().select("-comments");
        console.log(booksDocs);
        res.json(booksDocs);
      } catch {
        res.send("error getting books");
      }
    })
    
    .post(function (req, res){
      let title = req.body.title;
      console.log(title);
      if(title === undefined) {
        res.send("missing required field title");
      } else {
        const newBook = new Book({
          title: title,
          commentcount: 0,
          comments: []
        });
        newBook.save((err, data) => {
          if(err) return console.err(err);
        });
        res.json(newBook._doc);
      }
    })
    
    .delete(async function(req, res){
      try {
        await Book.remove({});
        res.send("complete delete successful");
      } catch {
        res.send("error deleting books");
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid).select("-commentcount");
        if(book === null) {
          res.send("no book exists");
        } else {
          res.json(book);
        }
      } catch {
        res.send("error getting book");
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(comment === undefined) {
        res.send("missing required field comment");
      } else {
        try {
          if(await Book.findById(bookid) === null) {
            res.send("no book exists");
          } else {
            await Book.findByIdAndUpdate(bookid, {
              $inc: {commentcount: 1},
              $push: {comments: comment}
            }, {new: true});
            res.json(await Book.findById(bookid).select("-commentcount"));
          }
        } catch {
          res.send("error updating book");
        }
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        if(await Book.findById(bookid) === null) {
          res.send("no book exists");
        } else {
          await Book.findByIdAndDelete(bookid);
          res.send("delete successful");
        }
      } catch {
        res.send("error deleting book");
      }
    });

  
};
