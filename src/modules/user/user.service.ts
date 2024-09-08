import { inject, injectable } from "tsyringe";
import { Repository } from "typeorm";
import { BadRequestException, NotFoundException } from "../../exceptions/http-exceptions";
import { Book } from "../book/book.entity";
import { BorrowRecord, User } from "./entities";
import { CacheService } from "../cache/cache.service";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private userRepository: Repository<User>,
    @inject("BookRepository") private bookRepository: Repository<Book>,
    @inject("BorrowRecordRepository") private borrowRecordRepository: Repository<BorrowRecord>,
    @inject(CacheService) private cacheService: CacheService
  ) {}

  /**
   * Get all users
   *
   * @returns array of users
   */
  public async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Get a user with books
   *
   * @param userId id of the user
   *
   * @returns a user with books
   */
  public async getUserWithBooks(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["borrowRecords", "borrowRecords.book"],
    });

    if (!user) {
      return null;
    }

    const pastBooks = user.borrowRecords
      ?.filter((record) => record.isReturned)
      .map((record) => ({
        name: record.book.name,
        userScore: record.userScore,
      }));

    const presentBooks = user.borrowRecords
      .filter((record) => !record.isReturned)
      .map((record) => ({
        name: record.book.name,
      }));

    user.books = {
      past: pastBooks || [],
      present: presentBooks,
    };

    return user;
  }

  /**
   * Create a new user
   *
   * @param name name of the user
   * @returns created user
   */
  public async createUser(name: string): Promise<User> {
    const user = this.userRepository.create({ name });
    return this.userRepository.save(user);
  }

  /**
   * Borrow a book
   *
   * @param userId id of the user
   * @param bookId id of the book
   * @param userScore user score
   * @returns borrowed book
   */
  public async borrowBook(userId: number, bookId: number): Promise<BorrowRecord> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException("Book not found");
    }

    const availableBorrowRecord = await this.borrowRecordRepository.findOne({
      where: { book: { id: book.id }, isReturned: false },
      relations: ["user"],
    });

    if (availableBorrowRecord?.user.id === user.id) {
      throw new BadRequestException("You already borrowed this book");
    } else if (availableBorrowRecord) {
      throw new BadRequestException("Book is already borrowed by another user");
    }

    const borrowRecord = this.borrowRecordRepository.create({
      user,
      book,
      userScore: 0,
      isReturned: false,
    });

    return this.borrowRecordRepository.save(borrowRecord);
  }

  /**
   * Return a book
   *
   * @param borrowRecordId id of the borrow record
   * @param userScore user score
   *
   * @returns returned book
   */
  public async returnBook(userId: number, bookId: number, userScore: number): Promise<BorrowRecord> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const book = await this.bookRepository.findOne({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException("Book not found");
    }

    const borrowRecord = await this.borrowRecordRepository.findOne({
      where: { user: { id: user.id }, book: { id: book.id }, isReturned: false },
    });

    if (!borrowRecord) {
      throw new NotFoundException("Borrow record not found");
    }

    borrowRecord.isReturned = true;
    borrowRecord.userScore = userScore;

    await this.borrowRecordRepository.save(borrowRecord);

    const newScoreOfBook = await this.calculateBookScore(bookId);

    await this.bookRepository.save({ ...book, score: newScoreOfBook });

    const key = `book-${bookId}`;
    const cachedBook = await this.cacheService.get(key);
    if (cachedBook) {
      await this.cacheService.del(key);
    }

    return this.borrowRecordRepository.save(borrowRecord);
  }

  /**
   * Calculate the average score of a book
   *
   * @param bookId id of the book
   *
   * @returns average score of the book
   */
  public async calculateBookScore(bookId: number): Promise<number> {
    const result = await this.borrowRecordRepository
      .createQueryBuilder("borrow_records")
      .select("AVG(borrow_records.userScore)", "averageScore")
      .where("borrow_records.bookId = :bookId", { bookId })
      .andWhere("borrow_records.isReturned = TRUE")
      .getRawOne();

    return parseFloat(result.averageScore) || 0;
  }
}
