'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function Home() {
  const [books, setBooks] = useState<any[]>()
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:golden+intitle:son&key=${process.env.NEXT_PUBLIC_API_KEY}`
        )
        const data = await res.json()
        console.log(data)
        setBooks(data.items)
      } catch (e) {
        console.log(e)
      }
    }
    fetchBook()
  }, [])
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1>Bookshelf</h1>
      {books &&
        books.map((book, idx) => {
          if (book.volumeInfo?.imageLinks?.smallThumbnail)
            return <img src={book.volumeInfo.imageLinks.smallThumbnail} alt='some book' key={idx}></img>
        })}
    </main>
  )
}
