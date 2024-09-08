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

- **User Management**: Create users, retrieve user details (including borrowed books), and manage their borrowing history.
- **Book Management**: Create books, retrieve book details, and manage book borrowing and returning.
- **Borrow & Return**: Users can borrow and return books, with the system tracking the borrowing history, including user scores for books they have read.
- **Dependency Injection**: Uses tsyringe for injecting repositories, services, and controllers, ensuring a modular and testable architecture.
- **Custom Error Handling**: Handles HTTP exceptions with custom HttpException classes and a global error middleware for consistent error responses.

## Technologies Used

- **Express.js**: Fast and minimal web framework for Node.js.
- **TypeORM**: ORM for managing database interactions with PostgreSQL.
- **PostgreSQL**: Relational database for storing users, books, and borrow records.
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
  │   │   ├── dto/        # User entity definition
  │     │   │   └── create-user.dto.ts    # Create user DTO with validation
  │     │   │   └── find-user.dto.ts    # Find user DTO with validation
  │     │   │   └── user.dto.ts    # User DTO for controlling data exposure and serialization
  │     │   │   └── return-book.dto.ts    # Return book DTO for score validation
  │   │   ├── entities/        # User entity definition
  │     │   │   └── borrow-record.entity.ts    # Borrow record entity of User
  │     │   │   └── user.entity.ts    # User entity definition
  │   │   └── user.service.ts       # User service for business logic
  │   │   └── user.controller.ts    # User controller
  │   ├── book/
  │   │   ├── dto/        # User entity definition
  │     │   │   └── create-book.dto.ts    # Create book DTO with validation
  │     │   │   └── find-book.dto.ts    # Find book DTO with validation
  │     │   │   └── book.dto.ts    # Book DTO for controlling data exposure and serialization
  │   │   └── book.entity.ts        # Book entity definition
  │   │   └── book.service.ts       # Book service for business logic
  │   │   └── book.controller.ts    # Book controller
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
POSTGRES_PORT=""
POSTGRES_DB=""
POSTGRES_USER=""
POSTGRES_PASSWORD=""
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
