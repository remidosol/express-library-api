import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validationMiddleware = <T extends object>(
  type: ClassConstructor<T>
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = plainToInstance(type, req.body);

    const errors = await validate(input);

    if (errors.length > 0) {
      const errorMessages = errors.map((err) => Object.values(err.constraints!)).flat();
      return res.status(400).json({ message: errorMessages[0] });
    } else {
      return next();
    }
  };
};
