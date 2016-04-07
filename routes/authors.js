var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //req all from database
  knex('authors').then(function(authorsData){
    console.log(authorsData);
    res.render('view_authors', { author: authorsData });
  })
});

router.get('/new', function(req, res, next) {
  //Insert book
  res.render('new_edit_authors', { title: 'New' });
});

router.post('/new', function(req, res, next) {
  //Insert book
  res.redirect('/');
});

router.get('/edit', function(req, res, next) {
  res.render('new_edit_authors', { title: 'Edit' });
});

router.post('/edit', function(req, res, next) {
  res.redirect('/');
});

router.get('/delete', function(req, res, next) {
  res.render('delete_author', { title: 'Delete' });
});

router.get('/:id', function(req, res, next) {
  //req id from database
  res.render('view_authors', { title: 'item data' });
});

module.exports = router;
