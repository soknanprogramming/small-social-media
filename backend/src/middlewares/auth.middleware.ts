import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token_from_cookie = req.cookies?.token;
  console.log("Token from cookie:", token_from_cookie);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token && !token_from_cookie) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET) as { id: string };
      req.userId = payload.id;
      next();
    } if (token_from_cookie) {
      const payload = jwt.verify(token_from_cookie, JWT_SECRET) as { id: string };
      req.userId = payload.id;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
