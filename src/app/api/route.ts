import { NextResponse } from "next/server";

const books = ["Book One", "Book Two", "Book Three"];

export async function GET() {
  return books;
}
