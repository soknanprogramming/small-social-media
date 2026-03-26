import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service";
import { loginSchema, registerSchema } from "../validations/user.validation";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const require = registerSchema.safeParse(req.body);

    if (!require.success) {
      console.error(require.error.issues);
      return res.status(400).json({
        error: require.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    const validatedData = require.data;

    const existingUser = await userService.findUserByEmail(validatedData.email);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await userService.createUser(validatedData);
    const { password, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const require = loginSchema.safeParse(req.body);

    if (!require.success) {
      console.error(require.error.issues);
      return res.status(400).json({
        error: require.error.issues.map((issue) => issue.message).join(", "),
      });
    }

    const validatedData = require.data;

    const user = await userService.findUserByEmail(validatedData.email);

    if (
      !user ||
      !(await userService.comparePassword(
        validatedData.password,
        user.password,
      ))
    ) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true, // JS can't access it (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error: any) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

export const getProfile = async (req: any, res: Response) => {
  const user = await userService.findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};
