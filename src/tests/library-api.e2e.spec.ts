import request from "supertest";
import app from "../app";

describe("Library API End-to-End Tests", () => {
  const baseUrl = process.env.HOST_BASE_URL;

  if (!baseUrl) {
    throw new Error("HOST_BASE_URL is not defined!");
  }

  it("should return all books", async () => {
    const res = await request(baseUrl).get("/books");

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book: any) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("name");
      expect(book).toHaveProperty("score");
    });
  });

  it("should create a new book", async () => {
    const newBook = {
      name: "1984",
    };

    const res = await request(baseUrl).post("/books").send(newBook);
    expect(res.status).toBe(201);
  });

  it("should return a book by ID", async () => {
    const res = await request(baseUrl).get("/books/1"); // Assuming book with ID 1 exists

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("score");
  });

  it("should return all users", async () => {
    const res = await request(baseUrl).get("/users");

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((user: any) => {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
    });
  });

  it("should create a new user", async () => {
    const newUser = {
      name: "İbrahim AKSÜT",
    };
    const res = await request(baseUrl).post("/users").send(newUser);

    expect(res.status).toBe(201);
  });

  it("should throw 400 due to user name is unique", async () => {
    const newUser = {
      name: "İbrahim AKSÜT",
    };

    const res = await request(baseUrl).post("/users").send(newUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("statusCode", 400);
    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should return a user by ID", async () => {
    const res = await request(baseUrl).get("/users/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("books");

    expect(res.body.books).toHaveProperty("past");
    expect(res.body.books).toHaveProperty("present");

    res.body.books.past.forEach((book: any) => {
      expect(book).toHaveProperty("name");
      expect(book).toHaveProperty("userScore");
    });

    res.body.books.present.forEach((book: any) => {
      expect(book).toHaveProperty("name");
    });
  });

  it("should borrow a book for a user", async () => {
    const res = await request(baseUrl).post("/users/1/borrow/1");

    expect(res.status).toBe(204);
  });

  it("should throw 400 if the book is already borrowed", async () => {
    const newUser = {
      name: "İrem AKSÜT",
    };

    const firstRes = await request(baseUrl).post("/users").send(newUser);

    expect(firstRes.status).toBe(201);

    const res = await request(baseUrl).post("/users/2/borrow/1");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("statusCode", 400);
    expect(res.body).toHaveProperty("message", "Book is already borrowed by another user");
  });

  it("should return a borrowed book for a user", async () => {
    const res = await request(baseUrl).post("/users/1/return/1").send({ score: 5 });

    expect(res.status).toBe(204);
  });
});
