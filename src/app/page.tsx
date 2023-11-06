"use client";
import axios from "axios";
import { useState } from "react";
import { SearchBar } from "../components/SearchBar";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export default function Home() {
  const [books, setBooks] = useState<any[]>();
  const [featuredBook, setFeaturedBook] = useState<any>();
  const [input, setInput] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get("https://www.googleapis.com/books/v1/volumes", {
        params: { q: input, key: apiKey },
      });
      setBooks(res.data.items);
      setInput("");
    } catch (e) {
      console.log(e);
    }
  };

  const handleBookClick = async (id: string) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
        params: { key: apiKey },
      });
      console.log(res.data);
      setFeaturedBook(res.data);
    } catch (e) {}
  };
  return (
    <main className="flex h-screen flex-col items-center gap-4">
      <h1>Bookshelf</h1>
      <SearchBar value={input} setValue={setInput} onSubmit={handleSearch} />
      <div className="flex w-1/2 items-center justify-between gap-2 overflow-y-auto rounded-md border border-black p-4">
        {books &&
          books.map((book, idx) => {
            if (book.volumeInfo?.imageLinks?.smallThumbnail)
              return (
                <img
                  src={book.volumeInfo.imageLinks.smallThumbnail}
                  alt="some book"
                  key={book.id + idx}
                  className="hover:cursor-pointer"
                  onClick={() => handleBookClick(book.id)}
                ></img>
              );
          })}
      </div>

      {featuredBook && (
        <div className="flex gap-2 rounded-md border border-black p-4">
          <img
            src={featuredBook.volumeInfo.imageLinks.smallThumbnail}
            alt="some book"
            className="h-min"
          ></img>
          <div>
            <h1 className="text-xl font-medium">{featuredBook.volumeInfo.title}</h1>
            <h1>Author(s): {featuredBook.volumeInfo.authors.join(", ")}</h1>
            <h1>Pages: {featuredBook.volumeInfo.pageCount}</h1>
            <h1>Avg. Rating: {featuredBook.volumeInfo.averageRating || "Unknown"}</h1>
          </div>
        </div>
      )}
    </main>
  );
}
