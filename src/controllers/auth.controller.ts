import bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

const generateUniqueReferralCode = async (
  firstName: string
): Promise<string> => {
  let newReferralCode: string;
  let isUnique = false;

  do {
    const randomChars = crypto.randomBytes(2).toString("hex").toUpperCase();
    newReferralCode = `${firstName
      .toUpperCase()
      .substring(0, 4)}${randomChars}`;
    const existingUser = await prisma.user.findUnique({
      where: { referralCode: newReferralCode },
    });
    if (!existingUser) {
      isUnique = true;
    }
  } while (!isUnique);

  return newReferralCode;
};

export const registerUser = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response
) => {
  const { email, password, firstName, lastName, referralCode } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const referrer = referralCode
      ? await prisma.user.findUnique({ where: { referralCode } })
      : null;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserReferralCode = await generateUniqueReferralCode(firstName);

    const newUser = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          referralCode: newUserReferralCode,
        },
      });

      if (referrer) {
        await tx.referral.create({
          data: {
            referrerId: referrer.id,
            referredUserId: createdUser.id,
          },
        });
      }

      return createdUser;
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginInput>,
  res: Response
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.BACKEND_JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ ...userWithoutPassword, accessToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
