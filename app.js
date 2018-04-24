const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const mysql = require('mysql');
import {port, config} from './config.js';
var knex = require('knex')({
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'rootpassword',
      database: 'strains'
    },
    pool: { min: 0, max: 7 }
  })
// import './scripts/dataMigration';

const app = express();

app.listen(port, (err) => {
    if (err) {
        return console.log('Oh no what happened?!', err);
    }
    
    console.log(`Server is listening on ${port}`);
})

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({ type: 'application/json' }));

  
export function throwError() {
    throw err;
}
