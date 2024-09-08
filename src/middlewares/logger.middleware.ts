import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.ip} to ${req.originalUrl ?? req.baseUrl} - ${res.statusCode} - ${duration}ms`;
    console.info(logMessage);
  });

  next();
};
