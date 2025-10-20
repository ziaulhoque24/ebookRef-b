import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        referralCode: referralCode,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
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
