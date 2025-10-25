import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { GetBooksQuery } from "../schemas/book.schema";

export const getBooks = async (
  req: Request<{}, {}, {}, GetBooksQuery>,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 10;

    const skip = (page - 1) * count;
    const take = count;

    const [books, totalBooks] = await prisma.$transaction([
      prisma.ebook.findMany({
        skip,
        take,
        include: {
          ebookGenres: {
            include: {
              genre: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.ebook.count(),
    ]);

    const booksWithGenres = books.map((book) => ({
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      genres: book.ebookGenres.map((eg) => eg.genre),
    }));

    res.status(200).json({
      items: booksWithGenres,
      total: totalBooks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const book = await prisma.ebook.findUnique({
      where: { id },
      include: {
        ebookGenres: {
          include: {
            genre: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const bookWithGenres = {
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author,
      price: book.price,
      coverImage: book.coverImage,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      genres: book.ebookGenres.map((eg) => eg.genre),
    };

    res.status(200).json(bookWithGenres);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
