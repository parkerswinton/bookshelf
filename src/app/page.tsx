'use client'
import axios from 'axios'
import { useState } from 'react'

const apiKey = process.env.NEXT_PUBLIC_API_KEY

export default function Home() {
  const [books, setBooks] = useState<any[]>()
  const [input, setInput] = useState('')

  const handleClick = async () => {
    try{
      const res = await axios.get('https://www.googleapis.com/books/v1/volumes', {params: {q: input, key: apiKey}})
      console.log(res)
      setBooks(res.data.items)
      setInput('')
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1>Bookshelf</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Search...'></input>
      <button onClick={handleClick} disabled={!input}>Search</button>
      {books &&
        books.map((book, idx) => {
          if (book.volumeInfo?.imageLinks?.smallThumbnail)
            return <img src={book.volumeInfo.imageLinks.smallThumbnail} alt='some book' key={idx}></img>
        })}
    </main>
  )
}
