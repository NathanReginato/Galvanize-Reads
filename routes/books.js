var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//req all from database
knex('books_and_authors')
    .fullOuterJoin('books', 'books_and_authors.book_id', '=', 'books.book_id')
    .fullOuterJoin('authors', 'books_and_authors.author_id', '=', 'authors.author_id')
    .select('title', 'description', 'cover_url')
    .select(knex.raw('array_agg(first_name) AS first_name ,array_agg(last_name) AS last_name'))
    .groupBy('title', 'description', 'cover_url')
    .then(function(bookjoin) {
      res.render('view_books', {book: bookjoin });
    })
})

router.get('/new', function(req, res, next) {
    //Insert book
    knex('authors')
    .select('first_name', 'last_name', 'author_id')
    .then(function(authorNames){
      res.render('new_edit_books', { title: 'New', action: 'new', name: authorNames });
    })
});

router.post('/newpost', function(req, res, next) {
    //Insert book
    console.log(req.body);
    var splitAuthorsString = req.body['authors-data'].split(',')


    if (splitAuthorsString[0] !== 'none') {
      var splitAuthors = splitAuthorsString.map(function(elem) {
        return parseInt(elem)
      })
      console.log(splitAuthors);
      console.log('with author');

    } else {
      //Insert book without author(s)!
      console.log('without author');
      knex('books')
      .returning('book_id')
      .insert({title: req.body['book-title'],
               description: req.body.description,
               cover_url: req.body['img-url']})
      .then(function(id){
        console.log(id);
      })
    }
    res.redirect('/');
});

router.get('/edit', function(req, res, next) {
    res.render('new_edit_books', {
        title: 'Edit'
    });
});

router.post('/edit', function(req, res, next) {
    res.redirect('/');
});


router.get('/delete', function(req, res, next) {
    res.render('delete_book', {
        title: 'Delete'
    });
});

router.get('/:id', function(req, res, next) {
    //req id from database
    knex('books_and_authors')
      .join('books', 'books_and_authors.book_id', '=', 'books.book_id')
      .join('authors', 'books_and_authors.author_id', '=', 'authors.author_id')
      .select('title', 'description', 'cover_url')
      .select(knex.raw('array_agg(first_name) AS first_name ,array_agg(last_name) AS last_name'))
      .groupBy('title', 'description', 'cover_url')
      .where({'books.book_id': req.params.id})
      .then(function(bookjoin) {
        res.render('view_books', {book: bookjoin });
      })
});

module.exports = router;
