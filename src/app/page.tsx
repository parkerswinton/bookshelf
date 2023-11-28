import axios from "axios";
import { SearchBar } from "../components/SearchBar";
import { redirect } from "next/navigation";
import { GET as getAllBooks } from "./api/route";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const getBooks = async (input: string) => {
  if (!input) return null;
  const res = await axios.get("https://www.googleapis.com/books/v1/volumes", {
    params: { q: input, key: apiKey },
  });
  return res.data.items;
};
const getBookDetails = async (id: string) => {
  const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`, {
    params: { key: apiKey },
  });
  return res.data;
};

const featured = async (formData: FormData) => {
  "use server";
  console.log(formData);
  redirect(`/?search=${formData.get("search")}&featured=${formData.get("featured")}`);
};

export default async function Home({ searchParams }: { searchParams: { [key: string]: string } }) {
  const books2 = await getAllBooks();
  console.log(books2);

  const input = searchParams["search"] || "";
  const featuredBook = searchParams["featured"] || "";
  const books = await getBooks(input);

  return (
    <main className="flex h-screen flex-col items-center gap-4">
      <h1>Bookshelf</h1>
      <SearchBar value={input} />
      <div className="flex w-1/2 items-center justify-between gap-2 overflow-y-auto rounded-md border border-black p-4">
        {books &&
          //@ts-ignore
          books.map((book, idx) => {
            if (book.volumeInfo?.imageLinks?.smallThumbnail)
              return (
                <form action={featured}>
                  <input hidden readOnly name="search" value={input}></input>
                  <input hidden readOnly name="featured" value={book.id}></input>
                  <button type="submit">
                    <img
                      src={book.volumeInfo.imageLinks.smallThumbnail}
                      alt="some book"
                      key={book.id + idx}
                      className="hover:cursor-pointer"
                    ></img>
                  </button>
                </form>
              );
          })}
      </div>

      <FeaturedBook id={featuredBook} />
    </main>
  );
}

const FeaturedBook = async ({ id }: { id: string | null }) => {
  if (!id) return null;

  const featuredBook = await getBookDetails(id);

  return (
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
  );
};
