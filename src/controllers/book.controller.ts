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
    const userId = req.user?.id;

    const skip = (page - 1) * count;
    const take = count;

    let purchasedEbookIds = new Set<string>();

    if (userId) {
      const userOrders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: true,
        },
      });

      purchasedEbookIds = new Set(
        userOrders.flatMap((order) => order.items.map((item) => item.ebookId))
      );
    }

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

    const booksWithGenres = books.map((book) => {
      const isPurchased = purchasedEbookIds.has(book.id);
      const bookData: any = {
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

      if (isPurchased) {
        bookData.fileUrl = book.fileUrl;
      }

      return bookData;
    });

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
    const userId = req.user?.id;

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

    let isPurchased = false;

    if (userId) {
      const userOrders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: true,
        },
      });

      const purchasedEbookIds = new Set(
        userOrders.flatMap((order) => order.items.map((item) => item.ebookId))
      );

      isPurchased = purchasedEbookIds.has(book.id);
    }

    const bookWithGenres: any = {
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

    if (isPurchased) {
      bookWithGenres.fileUrl = book.fileUrl;
    }

    res.status(200).json(bookWithGenres);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
