import { Request, Response, NextFunction } from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";

export function serializerMiddleware<T>(dto: ClassConstructor<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send.bind(res);

    res.send = (body: any) => {
      if (Array.isArray(body)) {
        body = body.map((item) => plainToInstance(dto, item));
      } else if (body) {
        body = plainToInstance(dto, body);
      }

      return originalSend(body);
    };

    next();
  };
}
