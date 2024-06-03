/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
// Define necessary variables
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create new Schema for Books

const BookSchema = new Schema({
  title: {type: String, required: true},
  comments: [String]
})

let Book = mongoose.model("Book", BookSchema)

 
module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      let bookArr = []

      Book
      .find({})
      .then(data => {
        if (data) {
          data.map(item => {
            let bookObj = {
              _id: item._id,
              title: item.title,
              commentcount: item.comments.length
            }
            bookArr.push(bookObj)
          })
          return res.json(bookArr)
        } else {
          return res.json({error: 'No books found'})
        }
      })
      .catch(err => {
        return res.json({error: err})
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        return res.json('missing required field title')
      }  

      let newBook = new Book({ title: title, comments: []})
      newBook
      .save()
      .then(data => {
        return res.json({title: data.title, _id: data.id})
      })
      .catch(err => {
        if (err) {
          return res.json({error: 'Error'})
        }
      })
    })
    
    .delete(function(req, res){

      Book
      .deleteMany({})
      .then(data => {
        if (data) {
          return res.json('complete delete successful')
        } else {
          return res.json({error: 'ERROR'})
        }
      })
      .catch(err => {
        return res.json({error: err})
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      Book
      .findById(bookid)
      .then(data => {
        if (data) {
          return res.json({
            _id: bookid,
            title: data.title,
            comments: data.comments
          })
        }else {
          return res.json('no book exists')
        }
      })
      .catch(err => {
        return res.json('no book exists')
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.json('missing required field comment')
      }

      Book
      .findById(bookid)
      .then(data => {
        if (data) {
          data.comments.push(comment)
        } else {
          return res.json('no book exists')
        }
        data.save()
        .then(data => {
          return res.json({
            _id: bookid,
            title: data.title,
            comments: data.comments
          })
        })
      })
      .catch(err => {
        return res.json('no book exists')
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;

      Book
      .findOneAndDelete({_id: bookid})
      .then(data => {
        if (data) {
          return res.json('delete successful')
        } else {
          return res.json('no book exists')
        }
      })
      .catch(err => {
        return res.json('no book exists')
      })
    });
  
};
