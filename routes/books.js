var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //req all from database
  res.render('view_books', { title: 'all data' });
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