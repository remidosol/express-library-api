# Library Case API

This project is an API for a library management system built using Express.js, TypeORM, PostgreSQL, and tsyringe for Dependency Injection (DI). It supports CRUD operations for users and books, along with the ability to borrow and return books. The project follows a modular architecture with service and repository patterns and includes custom error handling using HttpException classes.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application with Docker](#running-the-application-with-docker)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Dependency Injection (DI) Setup](#dependency-injection-di-setup)
- [License](#license)

## Features

### User Management

- Create users and retrieve user details, including their current and past borrowed books.
- Manage each user's borrowing history, providing a detailed view of the books they have borrowed or are currently reading.

### Book Management

- Create, update, and delete books.
- Retrieve detailed information about each book, including user scores and borrowing statistics.

### Borrow & Return

- Users can borrow and return books, with a system that tracks the borrowing history.
- After returning a book, users can provide a score, which the system uses to calculate the book’s average rating.
- The system handles multiple borrowing scenarios, ensuring accurate tracking of each user's borrowing activity.

### Dependency Injection

- Uses **tsyringe** for injecting repositories, services, and controllers, promoting a modular, maintainable, and testable architecture.
- This design ensures that components are loosely coupled and easy to mock for unit tests, simplifying the development process.

### Custom Error Handling

- The API uses custom HttpException classes to handle HTTP errors consistently.
- A global error middleware captures all unhandled exceptions and provides structured error responses, improving API robustness and user feedback.

### Redis Caching

- Integrates Redis to cache frequently requested data, such as book listings or user details, to improve performance.
- Configurable TTL (Time-to-Live) for each cached item ensures that cached data stays fresh while reducing unnecessary database calls.
- The cache can be easily invalidated or refreshed based on custom logic, ensuring that the application remains responsive and scalable.

### End-to-End (E2E) Testing

- Comprehensive E2E tests using Jest and Supertest to ensure that the API endpoints work as expected.
- Tests simulate actual HTTP requests and validate the behavior of user and book management, borrowing, and returning functionality.
- Tests can be executed in a Dockerized environment, ensuring that the entire system, including the database and cache, is tested in real-world conditions.

### Dockerized Setup

- Docker Compose is used to orchestrate services like the Express.js application, PostgreSQL, and Redis.
- Easily set up and run the application in a containerized environment, providing a consistent development and deployment experience across different environments.

### Database Synchronization

- Leverages TypeORM for database migrations and synchronization, ensuring that the PostgreSQL schema is up to date with the entity definitions.
- Supports automatic schema synchronization during development and migration scripts for production environments.

## Technologies Used

- **Node.js**: JavaScript runtime environment for server-side development.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Express.js**: Fast and minimal web framework for Node.js.
- **TypeORM**: ORM for managing database interactions with PostgreSQL.
- **PostgreSQL**: Relational database for storing users, books, and borrow records.
- **Redis**: In-memory data structure store, used for caching.
- **Jest**: JavaScript testing framework, used for writing unit and end-to-end tests.
- **Supertest**: Library for testing HTTP servers, integrated with Jest for E2E tests.
- **Docker**: Containerization platform used to package applications and dependencies.
- **Docker Compose**: Tool for defining and running multi-container Docker applications.
- **tsyringe**: Lightweight Dependency Injection container for TypeScript.
- **class-transformer**: For DTO transformations and controlling what data is exposed in API responses.
- **class-validator**: For validating input data.

## Prerequisites

- Node
- Yarn
- Docker

## Project Structure

```bash
src/
  ├── config/
  │   └── container.ts              # Dependency injection container setup
  │   └── database.ts              # Database configuration
  ├── exceptions/
  │   └── http.exception.abstract.ts         # Base HttpException abstract class
  │   ├── http-exceptions/
  │   │   └── not-found.exception.ts    # 404 Not Found Exception
  │   │   └── bad-request.exception.ts  # 400 Bad Request Exception
  │   │   └── internal-server-error.exception.ts  # 500 Internal Server Error Exception
  ├── middlewares/
  │   └── error.middleware.ts       # Global error handling middleware
  │   └── serializer.middleware.ts # Middleware for transforming responses
  │   └── validation.middleware.ts # Middleware for validation with class-validator
  │   └── logger.middleware.ts # Middleware for logging requests
  ├── modules/
  │   ├── user/
  │   │   ├── dto/        # User DTOs
  │   │   │   └── create-user.dto.ts    # Create user DTO with validation
  │   │   │   └── find-user.dto.ts    # Find user DTO with validation
  │   │   │   └── return-book.dto.ts    # Return book DTO with validation
  │   │   │   └── user.dto.ts    # User DTO for controlling data exposure and serialization
  │   │   │   └── return-book.dto.ts    # Return book DTO for score validation
  │   │   ├── entities/        # User entity definition
  │   │   │   └── borrow-record.entity.ts    # Borrow record entity of User
  │   │   │   └── user.entity.ts    # User entity definition
  │   │   └── user.service.ts       # User service for business logic
  │   │   └── user.controller.ts    # User controller
  │   ├── book/
  │   │   ├── dto/        # Book DTOs
  │   │   │   └── create-book.dto.ts    # Create book DTO with validation
  │   │   │   └── find-book.dto.ts    # Find book DTO with validation
  │   │   └── book.entity.ts        # Book entity definition
  │   │   └── book.service.ts       # Book service for business logic
  │   │   └── book.controller.ts    # Book controller
  │   │   └── book.middleware.ts    # Book middleware to cache fetched 
  ├── tests/
  │   └── library-api.e2e.spec.ts              # E2E tests of Library API
  └── app.ts                        # Application entry point
  └── server.ts                     # Server setup
```

## Installation

Clone the repository:

```bash
git clone https://github.com/remidosol/express-library-api.git
cd express-library-api
```

## Running the Application with Docker

Ensure Docker and Docker Compose are installed and then run:

```bash
docker compose up -d --build
```

This command will build the Docker image if it's not already built and start all services defined in `docker-compose.yml`, including the NestJS application and PostgreSQL.

## Environment Variables

Ensure that you have a .env file located in `<rootDir>/.env`. This file should contain all the necessary environment variables required by the application.

Create a .env file in the secrets directory with the following variables:

```.env
POSTGRES_HOST=""
POSTGRES_PORT="5432"
POSTGRES_DB=""
POSTGRES_USER=""
POSTGRES_PASSWORD=""

REDIS_URL=""
REDIS_HOST=""
REDIS_PORT="6379"
```

## Endpoints

Here are the main API endpoints

### User Endpoints

- **GET /users**: Get a list of all users.
- **GET /users/:userId**: Get a specific user by ID, including their borrowed books.
- **POST /users**: Create a new user.

### Book Endpoints

- **GET /books**: Get a list of all books.
- **GET /books/:bookId**:bookId: Get a specific book by ID, including its average score.
- **POST /books**: Create a new book.

### Borrow/Return Endpoints

- **POST /users/:userId/borrow/:bookId**: Borrow a book.
- **POST /users/:userId/return/:bookId**: Return a book with an optional user score.

## Testing

### Running Tests with Docker

To run the tests within the Docker environment, use the following Docker Compose command:

```bash
docker exec -it library_api yarn test:e2e
```

This command executes the tests inside the Docker container, ensuring that the testing environment is consistent with the development setup.

## Error Handling

The API uses a global error-handling middleware with custom `HttpException` classes for consistent error responses.

- **400 Bad Request**: Returned when invalid input data is provided.
- **404 Not Found**: Returned when the requested resource (e.g., user or book) does not exist.
- **500 Internal Server Error**: Returned for unhandled exceptions.

## Example Response

Getting a user with borrowed books

**Request**:

```http
GET /users/1
```

**Response**:

```json
{
  "id": 1,
  "name": "John Doe",
  "books": {
    "past": [
      {
        "name": "1984",
        "userScore": 5
      }
    ],
    "present": [
      {
        "name": "Brave New World"
      }
    ]
  }
}
```

## Dependency Injection (DI) Setup

This project uses `tsyringe` for DI. Repositories and services are registered in [`container.ts`](src/config/container.ts), and injected into controllers and services using `@inject()`.

For example, `UserRepository` and [`UserService`](src/modules/user/user.service.ts) are injected into [`UserController`](src/modules/user/user.controller.ts) as follows:

```ts
@injectable()
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService
  ) {}
}
```

## License

This project is licensed under the MIT License.
