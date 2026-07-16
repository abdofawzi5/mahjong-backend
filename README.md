# Mahjong Backend

A lightweight Express backend API built with TypeScript and SQLite to serve a Mahjong Leaderboard.

## Tech Stack

- **Node.js** & **Express**
- **TypeScript**
- **SQLite** (In-memory for tests, file-based for development)
- **Jest** & **Supertest** (Testing)
- **ESLint** (Linting)

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Running the Server

Start the development server with live reload (Nodemon + TSX):

```bash
npm run dev
```

The server will start on `http://localhost:3001`.

### API Endpoints

- `GET /api/leaderboard`: Fetch the top 5 scores.
- `POST /api/leaderboard`: Add a new score.
  - Body: `{ "name": "Player Name", "score": 1200 }`

## Testing

The backend includes a comprehensive test suite using Jest, Supertest, and Faker for data generation. Tests run in an isolated in-memory SQLite database.

```bash
# Run all tests
npm test

# Run tests with coverage (CI mode)
npm run test:ci
```

## Linting

```bash
npm run lint
```
