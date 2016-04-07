var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //req all from database
  knex('books').pluck('book_id').then(function(bookid){
    bookid.forEach(function(elem){
      knex('books_and_authors')
      .where({book_id: elem})
      .pluck('author_id')
      .then(function(id){
        return knex('authors')
        .whereIn('author_id', id).select('first_name', 'last_name').then(function(name){
          console.log(name);
        })
      }).then(function(){
        knex('books').where({book_id: elem}).then(function(book){
          console.log(book);
        })
      })
    })
  })
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
