var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //req all from database
  var x = 1;
  booksObject = {}
  knex('books_and_authors')
    .where({book_id: x}).pluck('author_id')
    .then(function(id){
      console.log(id);
      return knex('authors')
        .whereIn('author_id', id)
        .pluck('first_name')
        .then(function(first){
          booksObject.first = first
          return knex('authors')
            .whereIn('author_id', id)
            .pluck('last_name')
            .then(function(last){
              booksObject.last = last
      })
    })
  }).then(function(){
    knex
  })
    // res.render('view_books', { book: booksData });
});

router.get('/new', function(req, res, next) {
  //Insert book
  res.render('new_edit_books', { title: 'New' });
});

router.post('/new', function(req, res, next) {
  //Insert book
  res.redirect('/');
});

router.get('/edit', function(req, res, next) {
  res.render('new_edit_books', { title: 'Edit' });
});

router.post('/edit', function(req, res, next) {
  res.redirect('/');
});


router.get('/delete', function(req, res, next) {
  res.render('delete_book', { title: 'Delete' });
});

router.get('/:id', function(req, res, next) {
  //req id from database
  res.render('view_books', { title: 'item data' });
});

module.exports = router;
