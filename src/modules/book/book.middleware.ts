import { NextFunction, Request, Response } from "express";
import { CacheService } from "../../modules/cache/cache.service";
import { BookService } from "./book.service";

export const bookCacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
  cacheService: CacheService,
  bookService: BookService
) => {
  try {
    const key = req.originalUrl || req.url;

    const originalJson = res.json.bind(res);

    const regex = /^\/books\/\d+$/;

    if (regex.test(key) && res.statusCode === 200) {
      const bookId = key.split("/")[2];
      const cachedBook = await cacheService.get(`book-${bookId}`);

      if (cachedBook) {
        return originalJson(JSON.parse(cachedBook));
      }

      const book = await bookService.getBook(Number(bookId));

      await cacheService.set(`book-${bookId}`, JSON.stringify(book));
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};
