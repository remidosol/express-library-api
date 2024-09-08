import { Request, Response, NextFunction } from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";

export function serializerMiddleware<T>(dto: ClassConstructor<T>) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);
    // const originalSend = res.send.bind(res);

    res.json = (body: any) => {
      if (Array.isArray(body)) {
        body = body.map((item) => plainToInstance(dto, item));
      } else if (body) {
        body = plainToInstance(dto, body);
      }

      return originalJson(body);
    };

    next();
  };
}
