class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" id=${book.id} class="delete">X</a></td>
        `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

const URL = 'https://640880cd2f01352a8a94c3fc.mockapi.io/books';

function getBooks() {
  return $.get(URL);
}

function displayBooks() {
  getBooks()
    .done(function (books) {
      books.forEach(function (book) {
        const ui = new UI();
        ui.addBookToList(book);
      });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus + ': ' + errorThrown);
    });
}

function addBook(book) {
  return $.ajax({
    url: URL,
    data: JSON.stringify(book),
    dataType: 'json',
    type: 'POST',
    contentType: 'application/json',
    crossDomain: true,
  });
}

function updateBook(book, id) {
  console.log('book:', book);
  let bookId = parseInt(id);

  return $.ajax({
    url: `${URL}/${bookId}`,
    dataType: 'json',
    data: JSON.stringify(book),
    contentType: 'application/json',
    crossDomain: true,
    type: 'PUT',
  });
}

function removeBook(id) {
  return $.ajax({
    url: `${URL}/${parseInt(id)}`,
    type: 'DELETE',
  });
}

document.addEventListener('DOMContentLoaded', displayBooks);

document.getElementById('book-form').addEventListener('submit', function (e) {
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  const book = new Book(title, author, isbn);
  const ui = new UI();
  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Please Fill in All the Fields', 'error');
  } else {
    addBook(book).done(function (createdBook) {
      console.log(createdBook);
      ui.addBookToList(createdBook);
      ui.showAlert('Book Added!', 'success');
      ui.clearFields();
    });
  }

  e.preventDefault();
});

document.getElementById('update-form').addEventListener('submit', function (e) {
  const title = document.getElementById('update-title').value,
    author = document.getElementById('update-author').value,
    isbn = document.getElementById('update-isbn').value,
    id = document.getElementById('id').value;

  const book = new Book(title, author, isbn);
  const ui = new UI();
  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Please Fill in All the Fields', 'error');
  } else {
    updateBook(book, id).done(function (updatedBook) {
      console.log(updatedBook);
      ui.showAlert('Book Updated! Please reload the page', 'success');
      ui.clearFields();
    });
  }

  e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function (e) {
  const ui = new UI();
  ui.deleteBook(e.target);
  removeBook(e.target.id);
  ui.showAlert('Book Deleted!', 'success');
  e.preventDefault();
});

document.getElementById('update').addEventListener('click', function () {
  document.getElementById('heading').innerHTML = 'Update Book';
  document.getElementById('book-form').style.display = 'none';
  this.style.display = 'none';
  document.getElementById('update-form').style.display = 'block';
});

  