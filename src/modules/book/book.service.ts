import { inject, injectable } from "tsyringe";
import { Book } from "./book.entity";
import { Repository } from "typeorm";

@injectable()
export class BookService {
  constructor(@inject("BookRepository") private bookRepository: Repository<Book>) {}

  /**
   * Get all books
   *
   * @returns array of books
   */
  public async getBooks(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  /**
   * Get a book by id
   *
   * @param bookId id of the book
   *
   * @returns a book
   */
  public async getBook(bookId: number): Promise<Book | null> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });

    return book;
  }

  /**
   * Create a new book
   *
   * @param name name of the book
   *
   * @returns created book
   */
  public async createBook(name: string): Promise<Book> {
    const book = this.bookRepository.create({ name });

    const createdBook = await this.bookRepository.save(book);

    return createdBook;
  }
}
