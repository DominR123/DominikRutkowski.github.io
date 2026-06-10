var express = require('express');
var router = express.Router();
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const dbPath = path.resolve(__dirname, '..', 'data.db');
const db = new DatabaseSync(dbPath);

router.get('/', function(req, res) {
    const books = db.prepare('SELECT * FROM book').all();
    res.render('books/index', { books });
});
router.get('/create', function(req, res){
    res.render('books/create');
});
router.post('/create', function(req, res) {
    const { title, author, year } = req.body;
    db.prepare('INSERT INTO book (title, author, year) VALUES (?, ?, ?)').run(title, author, year);
    res.redirect('/books');
});
router.get('/:id', function(req, res) {
    const book = db.prepare('SELECT * FROM book WHERE id = ?').get(req.params.id);
    res.render('books/show', { book });
});

router.get('/:id/edit', function (req, res) {
    const book = db.prepare('SELECT * FROM book WHERE id = ?').get(req.params.id);
    res.render('books/edit', { book });
});
router.post('/:id/edit', function(req, res) {
    const { title, author, year } = req.body;
    db.prepare('UPDATE book SET title = ?, author = ?, year = ? WHERE id = ?').run(title, author, year, req.params.id);
    res.redirect('/books');
});
router.post('/:id/delete', function(req, res) {
    db.prepare('DELETE FROM book WHERE id = ?').run(req.params.id);
    res.redirect('/books');
});

module.exports = router;