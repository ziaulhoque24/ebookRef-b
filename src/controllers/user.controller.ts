import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referralsMade: {
          include: {
            referredUser: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalReferredUsers = user.referralsMade.length;
    const convertedUsers = user.referralsMade.filter(
      (referral) => referral.status === "CONVERTED"
    ).length;

    const conversionRate =
      totalReferredUsers > 0
        ? Number(((convertedUsers / totalReferredUsers) * 100).toFixed(2))
        : 0;

    const frontendUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const referralLink = `${frontendUrl}/register?referralCode=${user.referralCode}`;

    res.status(200).json({
      totalReferredUsers,
      convertedUsers,
      conversionRate,
      credits: user.credits,
      referralLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyBooks = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            ebook: {
              include: {
                ebookGenres: {
                  include: {
                    genre: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const purchasedEbooksMap = new Map();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!purchasedEbooksMap.has(item.ebook.id)) {
          purchasedEbooksMap.set(item.ebook.id, {
            id: item.ebook.id,
            title: item.ebook.title,
            description: item.ebook.description,
            author: item.ebook.author,
            price: item.ebook.price,
            coverImage: item.ebook.coverImage,
            fileUrl: item.ebook.fileUrl,
            purchasedAt: order.createdAt,
            genres: item.ebook.ebookGenres.map((eg) => eg.genre),
          });
        }
      });
    });

    const books = Array.from(purchasedEbooksMap.values());

    res.status(200).json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
