/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
// This file connects to the database

// This file connects to the database
var mysql = require('mysql');
require('dotenv').config();
const fs = require('fs');

module.exports = {
  development: {
    insecureAuth: true,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'Whats4Dinner_db',
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  },
  test: {
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASS,
    database: 'test_Whats4Dinner_db',
    host: process.env.TEST_DB_HOST,
    dialect: 'mysql',
    logging: false
    // insecureAuth: true
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'Whats4Dinner_db',
    host: process.env.DB_HOST,
    dialect: 'mysql',
    insecureAuth: true
  }
};
