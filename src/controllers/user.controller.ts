import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
