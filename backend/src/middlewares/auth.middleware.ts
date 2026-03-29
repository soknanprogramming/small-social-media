import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { debug } from "../tools/debug.tool";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token_from_cookie = req.cookies?.token;
  // debug(`"Token from cookie: ${token_from_cookie}`);
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token && !token_from_cookie) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const activeToken = token || token_from_cookie;
    const payload = jwt.verify(activeToken, JWT_SECRET) as { id: string };
    req.userId = payload.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Optional auth middleware - doesn't require token but sets userId if valid token is provided
export const optionalAuthMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token_from_cookie = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token || token_from_cookie) {
    try {
      const activeToken = token || token_from_cookie;
      const payload = jwt.verify(activeToken, JWT_SECRET) as { id: string };
      req.userId = payload.id;
    } catch (error) {
      // Invalid token, continue without userId
    }
  }

  next();
};
