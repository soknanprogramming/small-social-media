import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userService from "../services/user.service";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validations/user.validation";
import { UserProfileResponseDto } from "../dto/user.dto";
import { AuthRequest } from "../types/auth.types";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

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
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true, // JS can't access it (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    const { password, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword, token });
  } catch (error: any) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await userService.findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(new UserProfileResponseDto(user));
};

// Middleware:
// - auth middleware to get userId from token and set it in req.userId
// - multer for file upload
// Requirements:
// - zod schema for name, bio (optional)
// - multipart/form-data: avatar (optional)
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const validateDate = updateProfileSchema.safeParse(req.body);

  if (!validateDate.success) {
    console.error(validateDate.error.issues);
    return res.status(400).json({
      error: validateDate.error.issues.map((issue) => issue.message).join(", "),
    });
  }

  // if (!req.userId) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  const { name, bio } = validateDate.data;
  const user = await userService.findUserById(req.userId!); // ! is used to assert that userId is not undefined

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    if (req.file) {
      const { buffer } = req.file;
      const folder = "avatars"; // You can change this to any folder you want in Cloudinary
      const { url, public_id } = await uploadToCloudinary(buffer, folder);
      const updatedUser = await userService.updateUserProfile(
        req.userId!,
        name,
        bio,
        url,
        public_id,
      );
      return res.status(200).json(new UserProfileResponseDto(updatedUser));
    } else {
      const updatedUser = await userService.updateUserProfile(
        req.userId!,
        name,
        bio,
      );
      return res.status(200).json(new UserProfileResponseDto(updatedUser));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
