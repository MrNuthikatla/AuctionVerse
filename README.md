# AuctionVerse – Full Stack Auction Platform

A full-stack auction web application where **sellers** can post products, **buyers** can place bids, and **admins** can manage auction statuses. Built using **Spring Boot** for the backend and **React.js (Vite)** for the frontend — all maintained within a **single monorepo**.

---

## Features

### Authentication & Roles
- Secure login for Admin, Seller, and Buyer
- JWT-based session management

### Seller
- Register and log in
- Post products for auction
- View and manage product listings

### Buyer
- Browse listings
- Filter by category and status
- Place bids
- Countdown timer for auctions

### Admin
- View all listings
- Change freeze product
- Download product reports

---

## Tech Stack

| Layer      | Tech               |
|------------|--------------------|
| Frontend   | React.js (Vite)    |
| Backend    | Spring Boot (Java) |
| Database   | PostgreSQL         |
| Auth       | JWT                |
| Styling    | CSS Modules        |
| Build Tool | Gradle             |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- Java 17+
- PostgreSQL running locally

---

### Run Backend

```bash
./gradlew bootRun
```

### Run Frontend
```bash
cd ebaazee-frontend
npm install
npm run dev
```
