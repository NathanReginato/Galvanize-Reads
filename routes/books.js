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
    .select('title', 'description', 'cover_url', 'genre', 'books.book_id')
    .select(knex.raw('array_agg(first_name) AS first_name ,array_agg(last_name) AS last_name'))
    .groupBy('title', 'description', 'cover_url', 'genre', 'books.book_id')
    .then(function(bookjoin) {
      // Implement at some point!!!!
      // for (var i = 0; i < bookjoin.first_name.length; i++) {
      //   fullname.push(bookjoin.first_name[i] + ' ' + bookjoin.last_name[i])
      // }
      res.render('view_books', { book: bookjoin });
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
          console.log(splitAuthors);
          if (!isNaN(splitAuthors[0])) {
            splitAuthors.forEach(function(authorsInArray){
              return knex('books_and_authors')
              .returning('id')
              .insert({book_id: id[0], author_id: authorsInArray})
              .then(function(id2){

              })
            })
          } else {
            console.log(id);
            return knex('books_and_authors')
            .returning('id')
            .insert({book_id: id[0], author_id: 0})
            .then(function(){
              console.log('inserted');
          })
        }
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
        return knex('books_and_authors')
        .pluck('author_id')
        .where({'book_id': req.params.id})
        .then(function(ids){
          return knex('authors')
          .select('first_name', 'last_name', 'author_id')
          .then(function(authorNames){
                var fullname = []
                for (var i = 0; i < bookjoin.first_name.length; i++) {
                  if (bookjoin.first_name[0] !== null) {
                    fullname.push({
                      first: bookjoin.first_name[i],
                      last: bookjoin.last_name[i],
                      id: ids[i]
                    })
                  }
                }
                res.render('new_edit_books', { title: 'Edit',
                                               action: 'edit',
                                               pTitle: bookjoin.title,
                                               pGenre: bookjoin.genre,
                                               pDes: bookjoin.description,
                                               pUrl: bookjoin.cover_url,
                                               name: authorNames,
                                               authors: fullname,
                                               bookId: req.params.id});
      })
    })
  })
});

router.post('/edit/editpost', function(req, res, next) {
  //write code here
  var authorIdArray
  var authorIdArrayString = req.body['authors-data'].split(',')
  var bookId = parseInt(req.body['book-id'])

  authorIdArray = authorIdArrayString.map(function(elem) {
    return parseInt(elem)
  })

  knex('books_and_authors')
  .where({'book_id': bookId})
  .del()
  .then(function() {
    return knex('books')
    .where({'book_id': bookId})
    .update({'title': req.body['book-title'],
             'genre': req.body.genre,
             'description': req.body.description,
             'cover_url': req.body['img-url']})
  })
  .then(function(){
    if (!isNaN(authorIdArray[0])) {
      authorIdArray.forEach(function(elem){
        return knex('books_and_authors')
        .returning('id')
        .insert({book_id: bookId, author_id: elem})
        .then(function(){
        })
      })
    }
  })
  res.redirect('/');
});

router.get('/delete/:id', function(req, res, next) {
  knex('books')
  .where({'book_id': req.params.id})
  .del()
  .then(function(){
    return knex('books_and_authors')
    .where({'book_id': req.params.id})
    .del()
  })
  res.redirect('/')
});

router.get('/:id', function(req, res, next) {
    //req book by id from database
    knex('books_and_authors')
      .fullOuterJoin('books', 'books_and_authors.book_id', '=', 'books.book_id')
      .fullOuterJoin('authors', 'books_and_authors.author_id', '=', 'authors.author_id')
      .select('title', 'description', 'cover_url', 'books.book_id')
      .select(
        knex.raw('array_agg(first_name) AS first_name ,array_agg(last_name) AS last_name'))
      .groupBy('title', 'description', 'cover_url', 'books.book_id')
      .where({'books_and_authors.book_id': req.params.id})
      .then(function(bookjoin) {
        console.log(bookjoin);
        res.render('view_books', {book: bookjoin });
      })
});

module.exports = router;
