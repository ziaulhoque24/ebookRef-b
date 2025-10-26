# E-book Referral & Credit System - Backend

A Node.js/Express backend service for the FileSure E-book platform with integrated referral and credit system.

## 📋 Overview

This backend provides RESTful API services for managing users, e-books, orders, and a referral/credit system. It uses Prisma ORM with MongoDB for data persistence and implements JWT-based authentication.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Referral System**: Unique referral codes for each user with tracking
- **Credit Management**: Earn and spend credits on e-book purchases
- **E-book Management**: Browse, and purchase e-books
- **Order Processing**: Complete order management with credit application
- **Genre-based Categorization**: Filter e-books by genres

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod schemas
- **Password Hashing**: bcryptjs

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- npm or yarn

### Setup Steps

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the backend directory:

   ```env
   DATABASE_URL="mongodb://your-mongodb-connection-string"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=4001
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Set up database**:

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Seed initial data (optional)
   npm run seed
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:4001`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run seed` - Seed database with initial data
- `npm run seedProd` - Seed production database

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user (supports referral code)
- `POST /api/auth/login` - User login

### Books

- `GET /api/books` - Get all e-books (with pagination & filters)
- `GET /api/books/:id` - Get single e-book details

### User

- `GET /api/user/profile` - Get user profile (authenticated)
- `GET /api/user/credits` - Get user credits and referral info
- `GET /api/user/referrals` - Get user's referral history

### Orders

- `POST /api/orders` - Create new order (with credit application)
- `GET /api/orders` - Get user's order history (authenticated)

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Protected routes require valid JWT tokens obtained from the login endpoint.

## 💳 Referral & Credit System

### How It Works

1. **Registration**: Each user receives a unique referral code upon registration
2. **Referral**: Users share their referral code; new signups using the code create a referral link
3. **Credit Earning**:
   - Referrer earns **20 credits** when referred user makes their first purchase
   - Referred user earns **10 credits** on their first purchase
4. **Credit Usage**: Credits can be applied to reduce e-book purchase costs (1 credit = 1 unit of currency)

### Referral Status

- `PENDING`: Referred user has signed up but hasn't made a purchase
- `CONVERTED`: Referred user has made their first purchase (credits awarded)

## 📊 Database Schema

### Key Models

- **User**: User accounts with referral codes and credits
- **Referral**: Tracks referral relationships and conversion status
- **Ebook**: E-book catalog with pricing and metadata
- **Genre**: E-book categories
- **Order**: Purchase orders with credit application
- **OrderItem**: Individual items in an order



## 🔧 Environment Variables

| Variable              | Description                 | Required |
| --------------------- | --------------------------- | -------- |
| `DATABASE_URL`        | MongoDB connection string   | Yes      |
| `JWT_SECRET`          | Secret key for JWT signing  | Yes      |
| `PORT`                | Server port (default: 4001) | No       |
| `NEXT_PUBLIC_APP_URL` | Frontend URL for CORS       | No       |

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding script
├── src/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middlewares
│   ├── routes/            # API route definitions
│   ├── schemas/           # Zod validation schemas
│   ├── lib/               # Utilities (Prisma client)
│   └── index.ts           # Application entry point
├── Dockerfile
├── package.json
└── tsconfig.json
```


