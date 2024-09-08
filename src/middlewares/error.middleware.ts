import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http-exception.abstract";

export function errorMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction) {
  if ((err as any).driverError?.code) {
    switch ((err as any).driverError.code) {
      case "23505":
        return res.status(409).json({
          statusCode: 409,
          message: "Conflict: Duplicate entry.",
          error: "UniqueConstraintViolation",
        });

      case "23503":
        return res.status(400).json({
          statusCode: 400,
          message: "Bad Request: Foreign key constraint violation.",
          error: "ForeignKeyViolation",
        });

      case "23502":
        return res.status(400).json({
          statusCode: 400,
          message: "Bad Request: Null value not allowed.",
          error: "NotNullViolation",
        });

      default:
        return res.status(500).json({
          statusCode: 500,
          message: "Internal Server Error: Database query failed.",
          error: err.message,
        });
    }
  }

  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    status,
    message,
  });
}
