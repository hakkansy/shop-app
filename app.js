const express = require('express');
const mysql = require('mysql');
const Promise = require('bluebird');
const bodyParser = require('body-parser');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'toko'
});
const queryAsync = Promise.promisify(connection.query.bind(connection));

connection.connect((err) => {
    if (err) {
        console.log('error connecting: '+err.stack);
        return;
    }
    console.log('success');
});

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.render('index.ejs');
});

app.get('/produk', (req,res) => {
    connection.query(
        'SELECT * FROM list',
        (error, results) => {
            res.render('produk.ejs', {produk:results});
        }
    );   
});

app.post('/tf-produk', (req, res) => {
    // Ketik kueri untuk menambahkan data ke database
    connection.query(
        'INSERT INTO list(Item, qty, price) SELECT (DISTINCT(itemName), SUM(qty), itemCost) FROM orders',
      (error, results) => {
        connection.query(
          'SELECT * FROM list',
          (error, results) => {
            res.render('produk.ejs', {items: results});
          }
        );  
      }
    );
});

app.get('/transaksi', (req,res) => {
    connection.query(
        'SELECT * FROM orders',
        (error, results) => {
          res.render('transaksi.ejs', {items: results});
        }
      );
});


app.get('/new', (req,res) => {
    res.render('new.ejs');
});

app.post('/create', (req,res) => {
    connection.query(
        'SELECT * FROM list',
        (error, results) => {
            res.render('index.ejs', {items: results});
        }
    );
});

app.listen(3000);