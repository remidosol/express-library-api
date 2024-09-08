import request from "supertest";
// import app from "../app";

describe("Library API End-to-End Tests", () => {
  it("should return all books", async () => {
    const res = await request(process.env.HOST_BASE_URL!).get("/books");
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((book: any) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("name");
      expect(book).toHaveProperty("score");
    });
  });

  it("should return a book by ID", async () => {
    const res = await request(process.env.HOST_BASE_URL!).get("/books/1"); // Assuming book with ID 1 exists

    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("score");
  });

  it("should create a new book", async () => {
    const newBook = {
      name: "1984",
    };
    const res = await request(process.env.HOST_BASE_URL!).post("/books").send(newBook);
    console.log(res.body);
    expect(res.status).toBe(201);
  });

  it("should return all users", async () => {
    const res = await request(process.env.HOST_BASE_URL!).get("/users");
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    res.body.forEach((user: any) => {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
    });
  });

  it("should return a user by ID", async () => {
    const res = await request(process.env.HOST_BASE_URL!).get("/users/1");
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("books");
  });

  it("should create a new user", async () => {
    const newUser = {
      name: "İbrahim AKSÜT",
    };
    const res = await request(process.env.HOST_BASE_URL!).post("/users").send(newUser);
    console.log(res.body);
    expect(res.status).toBe(201);
  });

  it("should borrow a book for a user", async () => {
    const res = await request(process.env.HOST_BASE_URL!).post("/users/1/borrow/1");
    console.log(res.body);
    expect(res.status).toBe(204);
  });

  it("should return a borrowed book for a user", async () => {
    const res = await request(process.env.HOST_BASE_URL!).post("/users/1/return/1").send({ score: 5 });
    console.log(res.body);
    expect(res.status).toBe(204);
  });
});
