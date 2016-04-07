exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('books', function(table){
    table.increments('book_id');
    table.string('title');
    table.string('genre');
    table.string('description')
    table.string('cover_url')
  })
  .createTable('authors', function(table){
    table.increments('author_id');
    table.string('first_name');
    table.string('last_name');
    table.string('bio');
    table.string('portrait_url')
  })
  .createTable('books_and_authors', function(table) {
    table.increments('id');
    table.integer('book_id').unsigned().references('book_id').inTable('books');
    table.integer('author_id').unsigned().references('author_id').inTable('authors');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema
  .dropTable('books')
  .dropTable('authors')
  .dropTable('books_and_authors');
};
