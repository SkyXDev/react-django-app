import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState("")
  const [releaseYear, setReleaseYear] = useState(0)
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    fetchbooks()
  }, [])

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchbooks = async() => {
    try{
      const response = await fetch(`${API_URL}/api/books/`);
      const data = await response.json();
      setBooks(data);
    }catch(err){
      console.log(err);
    };
  };

  const addBook = async () => {
    const bookData = {
      bookTitle: title,
      release_year: releaseYear
    }
    try{
      const response = await fetch(`${API_URL}/api/books/create/`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json()
      setBooks ((prev) => [...prev, data])
    } catch (err){
      console.log(err)
    }
  }

  const updateTitle = async (pk, release_year) => {
    const bookData = {
      bookTitle: newTitle,
      release_year
    }
    try{
      const response = await fetch(`${API_URL}/api/books/${pk}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json()
      setBooks((prev) => prev.map((book) => {
        if (book.id === pk){
          return data;
        }else{
          return book;
        }
      }))
    } catch (err){
      console.log(err)
    }
  }

  const deleteBook = async (pk) => {
    try{
      const response = await fetch(`${API_URL}/api/books/${pk}`, {
        method: "DELETE",
      });

      setBooks((prev) => prev.filter((book) => book.id !== pk))
    }catch (err){
      console.log(err)
    }
  }

  return (
    <>
      <h1>Book Website</h1>
      <div>
        <input type="text" placeholder='Book Title...' onChange={(e) => setTitle(e.target.value)}/>
        <input type="number" placeholder='Release Year' onChange={(e) => setReleaseYear(e.target.value)}/>
        <button onClick={addBook}>Add book</button>
      </div>
      {books.map((book) => 
        <div>
          <p>Title: {book.bookTitle}</p>
          <p>Release Year: {book.release_year}</p>
          <input type="text" placeholder='New title' onChange={(e) => setNewTitle(e.target.value)} />
          <button onClick={() => updateTitle(book.id, book.release_year)}>Change title</button>
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      )}
    </>
  )
}

export default App
