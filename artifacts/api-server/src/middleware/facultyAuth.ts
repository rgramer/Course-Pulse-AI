import type { Request, Response, NextFunction } from "express";

export function requireFacultyAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.signedCookies?.cp_faculty === "1") {
    next();
    return;
  }
  res.status(401).json({ error: "Faculty authentication required." });
}
