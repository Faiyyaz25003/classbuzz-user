"use client";
import { useState } from "react";
import PDFViewer from "./PDFViewer";

export default function Library() {
  const books = [
    {
      id: 1,
      course: "BCA",
      subject: "Java",
      name: "Java Programming",
      pdf: "/sample.pdf",
    },
    {
      id: 2,
      course: "BCA",
      subject: "DBMS",
      name: "Database Management",
      pdf: "/sample.pdf",
    },
  ];

  const [myBooks, setMyBooks] = useState([]);
  const [openBook, setOpenBook] = useState(null);

  const getBook = (book) => {
    const accessDate = new Date();

    const expiryDate = new Date();

    expiryDate.setDate(accessDate.getDate() + 7);

    setMyBooks([
      ...myBooks,
      {
        ...book,
        accessDate,
        expiryDate,
      },
    ]);
  };

  const openBookViewer = (book) => {
    const today = new Date();

    if (today > new Date(book.expiryDate)) {
      alert("Book Expired");

      return;
    }

    setOpenBook(book);
  };

  return (
    <div className="p-10  ml-[300px] mt-[50px]">
      <h1 className="text-3xl font-bold mb-10">Library</h1>

      {/* ALL BOOKS */}

      <h2 className="text-xl font-semibold mb-4">All Books</h2>

      <div className="grid grid-cols-3 gap-6 mb-12">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded-xl">
            <h3 className="font-bold">{book.name}</h3>

            <p className="text-sm text-gray-500">
              {book.course} • {book.subject}
            </p>

            <button
              onClick={() => getBook(book)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              GET BOOK
            </button>
          </div>
        ))}
      </div>

      {/* MY BOOKS */}

      <h2 className="text-xl font-semibold mb-4">My Books</h2>

      <div className="grid grid-cols-3 gap-6">
        {myBooks.map((book) => (
          <div key={book.id} className="border p-4 rounded-xl">
            <h3 className="font-bold">{book.name}</h3>

            <p className="text-sm text-gray-500">
              Expire: {new Date(book.expiryDate).toDateString()}
            </p>

            <button
              onClick={() => openBookViewer(book)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Open Book
            </button>
          </div>
        ))}
      </div>

      {openBook && <PDFViewer pdf={openBook.pdf} />}
    </div>
  );
}
