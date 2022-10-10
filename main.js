document.addEventListener('DOMContentLoaded', () => {
  const formSubmit = document.querySelector('#inputBook');
  const formSearch = document.querySelector('#searchBook');

  formSubmit.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
  });

  formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    searchObject();
  });

  loadBooks();
});

const RENDER_EVENT = 'render-books';
const RENDER_SEARCH = 'render-search';
const LOAD_DATA = 'load-data';

let books = [];

const loadBooks = () => {
  const bookStorage = JSON.parse(localStorage.getItem('books'));
  console.log(bookStorage);

  if (bookStorage !== null) {
    books = bookStorage;
  }

  document.dispatchEvent(new Event(LOAD_DATA));
};

const addBook = () => {
  const id = Number(new Date());

  const title = document.querySelector('#inputBookTitle').value;
  const author = document.querySelector('#inputBookAuthor').value;
  const year = document.querySelector('#inputBookYear').value;

  const isComplete = document.querySelector('#inputBookIsComplete').checked;

  const book = generateBooks(id, title, author, year, isComplete);

  books.push(book);

  localStorage.setItem('books', JSON.stringify(books));
  loadBooks();
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
  console.log(getId);
  if (getId == null) return;

  getId.isComplete = true;
  localStorage.setItem('books', JSON.stringify(books));

  document.dispatchEvent(new Event(LOAD_DATA));
};

const unfinishedBooks = (bookId) => {
  const getId = findId(bookId);
  if (getId == null) return;

  getId.isComplete = false;
  localStorage.setItem('books', JSON.stringify(books));

  document.dispatchEvent(new Event(LOAD_DATA));
};

const deleteBook = (bookId) => {
  const getId = findId(bookId);
  if (getId == null) return;
  const getIndexId = books.findIndex((book) => {
    return book.id === bookId;
  });

  books.splice(getIndexId, 1);
  localStorage.setItem('books', JSON.stringify(books));

  document.dispatchEvent(new Event(LOAD_DATA));
};

const findBookByTitle = () => {};
const searchResult = (inputTitle) => {
  const getBookByTitle = books.filter((book) => {
    return book.title === inputSearch.value;
  });

  console.log(getBookByTitle);
};

const generateSearch = (bookObject) => {
  const article = document.createElement('article');
  article.setAttribute('class', 'book_item');

  const titleBook = document.createElement('h3');
  const authorText = document.createElement('p');
  const yearText = document.createElement('p');

  titleBook.innerText = bookObject.title;
  authorText.innerText = `Penulis: ${bookObject.author}`;
  yearText.innerText = `Tahun ${bookObject.year}`;

  article.append(titleBook, authorText, yearText);
  return article;
};

const searchObject = () => {
  const inputSearch = document.querySelector('#searchBookTitle');

  const searchResult = document.querySelector('#searchBookResult');

  for (const book of books) {
    const searchBook = generateSearch(book);
    if (inputSearch.value === book.title) {
      searchResult.append(searchBook);
    }
  }
};

const bookObject = () => {
  const completeBooks = document.querySelector('#completeBookshelfList');
  completeBooks.innerHTML = '';

  const incompleteBooks = document.querySelector('#incompleteBookshelfList');
  incompleteBooks.innerHTML = '';

  for (const book of books) {
    const bookObject = makeBooks(book);
    if (!book.isComplete) {
      incompleteBooks.append(bookObject);
    } else {
      completeBooks.append(bookObject);
    }
  }

  // for (const book of books) {
  //   const searchGenerate = searchBook(book);
  //   console.log(searchGenerate);
  // }
  // const searchGenerate = searchBook(books);
};

// document.addEventListener(RENDER_SEARCH, () => {
//   searchObject();
// });

document.addEventListener(LOAD_DATA, () => {
  bookObject();
});

// document.addEventListener(RENDER_EVENT, () => {

// });
