var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

/* GET home page. */

//books-------------------------------------------------------------------------
router.get('/', function(req, res, next) {
//req all from database
knex('books_and_authors')
    .fullOuterJoin('books', 'books_and_authors.book_id', '=', 'books.book_id')
    .fullOuterJoin('authors', 'books_and_authors.author_id', '=', 'authors.author_id')
    .select('title', 'description', 'cover_url')
    .select(knex.raw('array_agg(first_name) AS first_name ,array_agg(last_name) AS last_name'))
    .groupBy('title', 'description', 'cover_url')
    .then(function(bookjoin) {
      // Implement at some point!!!!
      // for (var i = 0; i < bookjoin.first_name.length; i++) {
      //   fullname.push(bookjoin.first_name[i] + ' ' + bookjoin.last_name[i])
      // }
      res.render('view_books', {book: bookjoin });
    })
})

//new---------------------------------------------------------------------------

router.get('/new', function(req, res, next) {
    //Insert book
    knex('authors')
    .select('first_name', 'last_name', 'author_id')
    .then(function(authorNames){
      res.render('new_edit_books', { title: 'New',
                                     action: 'new',
                                     name: authorNames
                                     });
    })
});

//postnew-----------------------------------------------------------------------

router.post('/newpost', function(req, res, next) {
    //Insert book
    var splitAuthorsString = req.body['authors-data'].split(',')

    //Insert books with author
    if (splitAuthorsString[0] !== 'none') {
      var splitAuthors = splitAuthorsString.map(function(elem) {
        return parseInt(elem)
      })
      knex('books')
      .returning('book_id')
      .insert({title: req.body['book-title'],
               description: req.body.description,
               cover_url: req.body['img-url']})
      .then(function(id){
        splitAuthors.forEach(function(authorsInArray){
          knex('books_and_authors')
          .returning('id')
          .insert({book_id: id[0], author_id: authorsInArray})
          .then(function(id2){
          })
        })
      })
    }

    //Insert book without author(s)!
    else {
      knex('books')
      .returning('book_id')
      .insert({title: req.body['book-title'],
               description: req.body.description,
               cover_url: req.body['img-url']})
      .then(function(id){
      })
    }
    res.redirect('/');
});

//edit--------------------------------------------------------------------------

router.get('/edit/:id', function(req, res, next) {

  knex('books_and_authors')
      .fullOuterJoin('books', 'books_and_authors.book_id', '=', 'books.book_id')
      .fullOuterJoin('authors', 'books_and_authors.author_id', '=', 'authors.author_id')
      .select('title', 'description', 'cover_url', 'genre')
      .select(knex.raw('array_agg(first_name) AS first_name ,array_agg(last_name) AS last_name'))
      .groupBy('title', 'description', 'cover_url', 'genre')
      .where({'books.book_id': req.params.id})
      .first()
      .then(function(bookjoin) {
        return knex('authors')
        .select('first_name', 'last_name', 'author_id')
        .then(function(authorNames){
              var fullname = []
              for (var i = 0; i < bookjoin.first_name.length; i++) {
                fullname.push(bookjoin.first_name[i] + ' ' + bookjoin.last_name[i])
              }
              console.log(fullname);
              res.render('new_edit_books', { title: 'Edit',
                                             action: 'edit',
                                             pTitle: bookjoin.title,
                                             pGenre: bookjoin.genre,
                                             pDes: bookjoin.description,
                                             pUrl: bookjoin.cover_url,
                                             name: authorNames,
                                             authors: fullname });

    })
  })
});

router.post('/editpost', function(req, res, next) {
    res.redirect('/');
});


router.get('/delete', function(req, res, next) {
    res.render('delete_book', {
        title: 'Delete'
    });
});

router.get('/:id', function(req, res, next) {
    //req book by id from database
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
