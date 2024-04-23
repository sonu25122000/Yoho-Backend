// authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../service/jwtService";
import { SUPERUSER_JWT_SECRET } from "../service/jwtSecret";

// middleware to verify token for superuser
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split("bearer")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token not provided" });
  }

  try {
    const decoded = verifyToken(token, SUPERUSER_JWT_SECRET);

    req.body.user = decoded; // Attach superuser data to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};
