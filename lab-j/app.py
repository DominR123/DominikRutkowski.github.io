from flask import Flask, render_template, request, url_for, redirect
import sqlite3
import os

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/')
def home():
    return render_template('books/index.html')

@app.route('/books')
def index():
    conn = get_db()
    books = conn.execute("SELECT * FROM book").fetchall()
    conn.close()
    return render_template('books/index.html', books=books)

@app.route('/books/create', methods=['GET','POST'])
def create():
    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']
        year = request.form['year']
        conn = sqlite3.connect('data.db')
        conn.execute('INSERT INTO book (title, author, year) VALUES (?, ?, ?)', (title, author, year))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    return render_template('books/create.html')

@app.route('/books/<int:id>')
def show(id):
    conn = get_db()
    book = conn.execute("SELECT * FROM book WHERE id = ?", (id,)).fetchone()
    conn.close()
    return render_template('books/show.html', book=book)

@app.route('/books/<int:id>/edit', methods=['GET','POST'])
def edit(id):
    conn = get_db()
    if request.method == 'POST':
        conn.execute('UPDATE book SET title = ?, author = ?, year = ? WHERE id = ?',
                     (request.form['title'], request.form['author'], request.form['year'], id))
        conn.commit()
        conn.close()
        return redirect(url_for('index'))
    book = conn.execute("SELECT * FROM book WHERE id = ?", (id,)).fetchone()
    conn.close()
    return render_template('books/edit.html', book=book)

@app.route('/books/<int:id>/delete', methods=('POST',))
def delete(id):
    conn = get_db()
    conn.execute('DELETE FROM book WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(port = 57811, debug = True)