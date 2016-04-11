
require('dotenv').config();
module.exports = {

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  },
  pool: {
    min: 2,
    max: 10
  },
  seeds: {
    directory: './seeds/'
  }

};
