import { SearchBar } from "../components/SearchBar";
import { redirect } from "next/navigation";
import { books_v1, google } from "googleapis";
import { book, db } from "@/db";
import { Rating } from "@/components/Rating";
import * as context from "next/headers";
import { auth } from "@/auth";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const books = google.books("v1");

const getBooks = async (input: string) => {
  if (!input) return null;
  const { data } = await books.volumes.list(
    { key: apiKey, q: input },
    { rootUrl: "https://books.googleapis.com/" },
  );
  return data.items;
};

const getBookDetails = async (id: string) => {
  const { data } = await books.volumes.get({ key: apiKey, volumeId: id });
  return data;
};

const featured = async (formData: FormData) => {
  "use server";
  redirect(`/?search=${formData.get("search")}&featured=${formData.get("featured")}`);
};

const addFeatured = async (b: books_v1.Schema$Volume, formData: FormData) => {
  "use server";
  if (!b.id || !b.volumeInfo || !b.volumeInfo.title) return;
  await db.insert(book).values({
    googleId: b.id,
    title: b.volumeInfo.title,
    author: b.volumeInfo.authors?.join("$$$"),
    pageCount: b.volumeInfo.pageCount,
    averageRating: b.volumeInfo.averageRating,
    imageLink: b.volumeInfo.imageLinks?.smallThumbnail,
  });
};

export default async function Home({ searchParams }: { searchParams: { [key: string]: string } }) {
  const input = searchParams["search"] || "";
  const featuredBook = searchParams["featured"] || "";

  const books = await getBooks(input);

  const session = await auth();

  return (
    <main className="flex h-screen flex-col items-center gap-4">
      <h1>Bookshelf</h1>
      <div>
        {!session ? <a href="/api/auth/signin">Login</a> : <div>hi {session.user?.name}</div>}
      </div>
      <SearchBar value={input} />
      <div className="flex w-1/2 items-center justify-between gap-2 overflow-y-auto rounded-md border border-black p-4">
        {books &&
          books.map((book, idx) => {
            if (book.volumeInfo?.imageLinks?.smallThumbnail)
              return (
                <form action={featured}>
                  <input hidden readOnly name="search" value={input}></input>
                  <input hidden readOnly name="featured" value={book.id!}></input>
                  <button type="submit">
                    <img
                      src={book.volumeInfo.imageLinks.smallThumbnail}
                      alt="some book"
                      key={book.id! + idx}
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
  const addFeaturedWithBook = addFeatured.bind(null, featuredBook);

  return (
    <div className="flex gap-2 rounded-md border border-black p-4">
      <img
        src={featuredBook.volumeInfo?.imageLinks?.smallThumbnail}
        alt="some book"
        className="h-min"
      ></img>
      <div>
        <h1 className="text-xl font-medium">{featuredBook.volumeInfo?.title}</h1>
        <h1>Author(s): {featuredBook.volumeInfo?.authors?.join(", ")}</h1>
        <h1>Pages: {featuredBook.volumeInfo?.pageCount}</h1>
        {featuredBook.volumeInfo?.averageRating ? (
          <Rating value={featuredBook.volumeInfo?.averageRating} />
        ) : (
          <h1>Unknown Rating</h1>
        )}

        <form action={addFeaturedWithBook}>
          <button type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
};
