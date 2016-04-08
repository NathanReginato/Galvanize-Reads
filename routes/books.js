var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//req all from database
knex('books_and_authors')
    .join('books', 'books_and_authors.book_id', '=', 'books.book_id')
    .join('authors', 'books_and_authors.author_id', '=', 'authors.author_id')
    .select('title')
    .select(knex.raw('string_agg(first_name, \', \') AS first_name ,string_agg(last_name, \' ,\') AS last_name'))
    .groupBy('title')
    .then(function(bookjoin) {
      console.log(bookjoin);
    })
    // console.log(bookjoin);
    // res.render('view_books', {book: bookjoin });
})

router.get('/new', function(req, res, next) {
    //Insert book
    res.render('new_edit_books', {
        title: 'New'
    });
});

router.post('/new', function(req, res, next) {
    //Insert book
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
    res.render('view_books', {
        title: 'item data'
    });
});

module.exports = router;
