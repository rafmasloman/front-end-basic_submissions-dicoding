const main = () => {};

document.addEventListener('DOMContentLoaded', () => {
  const formSubmit = document.querySelector('#inputBook');

  formSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });
});

const books = [];
const RENDER_EVENT = 'render-todo';

const addBook = () => {
  const id = Number(new Date());

  const title = document.querySelector('#inputBookTitle').value;
  const author = document.querySelector('#inputBookAuthor').value;
  const year = document.querySelector('#inputBookYear').value;

  const isComplete = document.querySelector('#inputBookIsComplete').checked;

  const book = generateBooks(id, title, author, year, isComplete);
  books.push(book);

  localStorage.setItem('books', books);

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const generateBooks = (id, title, author, year, isComplete) => {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
};

const makeBooks = (bookObject) => {
  const article = document.createElement('article');
  article.setAttribute('class', 'book_item');

  const titleBook = document.createElement('h3');
  const authorText = document.createElement('p');
  const yearText = document.createElement('p');

  if (bookObject.isComplete) {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const finishButton = document.createElement('button');
    finishButton.classList.add('green');
    finishButton.innerText = 'Belum Selesai Dibaca';

    finishButton.addEventListener('click', (e) => {
      const finished = unfinishedBooks(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';

    deleteButton.addEventListener('click', (e) => {
      const deleted = deleteBook(bookObject.id);
    });

    titleBook.innerText = bookObject.title;
    authorText.innerText = `Penulis: ${bookObject.author}`;
    yearText.innerText = `Tahun ${bookObject.year}`;

    buttonContainer.append(finishButton, deleteButton);
    article.append(titleBook, authorText, yearText, buttonContainer);
  } else {
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const finishButton = document.createElement('button');
    finishButton.classList.add('green');
    finishButton.innerText = 'Selesai Dibaca';

    finishButton.addEventListener('click', (e) => {
      const finished = finishBooks(bookObject.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';

    deleteButton.addEventListener('click', (e) => {
      const deleted = deleteBook(bookObject.id);
    });

    titleBook.innerText = bookObject.title;
    authorText.innerText = `Penulis: ${bookObject.author}`;
    yearText.innerText = `Tahun ${bookObject.year}`;

    buttonContainer.append(finishButton, deleteButton);
    article.append(titleBook, authorText, yearText, buttonContainer);
  }

  return article;
};

const findId = (bookId) => {
  const id = books.filter((book) => {
    return book.id === bookId ? book : null;
  });
  return id[0];
};

const finishBooks = (bookId) => {
  const getId = findId(bookId);
  if (getId == null) return;

  getId.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const unfinishedBooks = (bookId) => {
  const getId = findId(bookId);
  if (getId == null) return;

  getId.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const deleteBook = (bookId) => {
  const getId = findId(bookId);
  if (getId == null) return;

  const getIndexId = books.findIndex((book) => {
    return book.id === bookId;
  });

  books.splice(getIndexId, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const bookObject = () => {
  const completeBooks = document.querySelector('#completeBookshelfList');
  completeBooks.innerHTML = '';

  const incompleteBooks = document.querySelector('#incompleteBookshelfList');
  incompleteBooks.innerHTML = '';

  const listBooks = localStorage.getItem('books');

  for (const book of books) {
    const bookObject = makeBooks(book);
    if (!book.isComplete) {
      incompleteBooks.append(bookObject);
    } else {
      completeBooks.append(bookObject);
    }
  }
};

document.addEventListener(RENDER_EVENT, () => {
  bookObject();
});
