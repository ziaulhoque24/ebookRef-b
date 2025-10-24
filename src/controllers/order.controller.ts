import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateOrderInput, GetOrdersQuery } from "../schemas/order.schema";

export const createOrder = async (
  req: Request<{}, {}, CreateOrderInput>,
  res: Response
) => {
  try {
    const userId = req.user.id;
    const { ebookIds, creditsToUse } = req.body;

    const purchasedItems = await prisma.orderItem.findMany({
      where: {
        order: {
          userId: userId,
        },
        ebookId: {
          in: ebookIds,
        },
      },
      select: {
        ebookId: true,
      },
    });

    if (purchasedItems.length > 0) {
      return res.status(400).json({
        message: "You have already purchased one or more of these ebooks",
        alreadyPurchasedIds: purchasedItems.map((item) => item.ebookId),
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referralReceived: {
          include: {
            referrer: true,
          },
        },
      },
    });



    if (creditsToUse > user.credits) {
      return res.status(400).json({
        message: `Insufficient credits. You have ${user.credits} credits available.`,
      });
    }

    const ebooks = await prisma.ebook.findMany({
      where: { id: { in: ebookIds } },
    });

    if (ebooks.length !== ebookIds.length) {
      return res.status(404).json({ message: "One or more ebooks not found" });
    }

    let totalAmount = 0;
    const orderItems = ebooks.map((ebook) => {
      totalAmount += ebook.price;
      return {
        ebookId: ebook.id,
        priceAtPurchase: ebook.price,
      };
    });

    const creditsUsed = Math.min(creditsToUse, totalAmount);
    const amountPaid = Math.max(0, totalAmount - creditsUsed);

    const isFirstPurchase = !user.hasMadePurchase;
    const wasReferred = user.referralReceived !== null;

    const firstPurchaseCredits = isFirstPurchase && wasReferred ? 2 : 0;
    const referrerPurchaseCredits = isFirstPurchase && wasReferred ? 2 : 0;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          creditsUsed: creditsUsed,
          amountPaid: amountPaid,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              ebook: true,
            },
          },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: firstPurchaseCredits - creditsUsed,
          },
          hasMadePurchase: true,
        },
      });

      if (isFirstPurchase && wasReferred && user.referralReceived) {
        await tx.referral.update({
          where: { id: user.referralReceived.id },
          data: { status: "CONVERTED" },
        });

        await tx.user.update({
          where: { id: user.referralReceived.referrerId },
          data: {
            credits: {
              increment: referrerPurchaseCredits,
            },
          },
        });
      }

      return createdOrder;
    });

    const creditsBalance = user.credits + firstPurchaseCredits - creditsUsed;

    const message =
      firstPurchaseCredits > 0
        ? `Order created successfully! You received ${firstPurchaseCredits} credits.`
        : "Order created successfully!";

    res.status(201).json({
      order,
      message,
      creditsEarned: firstPurchaseCredits,
      creditsBalance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrders = async (
  req: Request<{}, {}, {}, GetOrdersQuery>,
  res: Response
) => {
  try {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 10;

    const skip = (page - 1) * count;
    const take = count;

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where: { userId },
        skip,
        take,
        include: {
          items: {
            include: {
              ebook: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({
        where: { userId },
      }),
    ]);

    res.status(200).json({
      items: orders,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
