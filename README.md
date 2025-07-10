# 🔗 Short URL API

A user-friendly REST API for creating, managing, and sharing shortened URLs. This service allows anyone to quickly generate short links for any destination.

## 🧰 Main Tech Stack

| Technology                                                                                     | Description                                            |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| ![Node.js](https://img.shields.io/badge/Node.js-22.17.0-brightgreen?logo=nodedotjs)            | Requires v22.17.0 (LTS) or higher within the 22.x line |
| ![NestJS](https://img.shields.io/badge/-NestJS-E0234E?logo=nestjs&logoColor=white)             | Modular Node.js backend framework with TypeScript      |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white) | Robust relational database                             |
| ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white)             | Type-safe ORM for Node.js and PostgreSQL               |

---

## 🌍 Public API (Deployed on AWS EC2)

This is a simple deployment hosted on an AWS EC2 instance using the free tier, designed to be publicly accessible for testing purposes.

> 📎 [http://3.235.135.79:3333/docs](http://3.235.135.79:3333/docs)

No setup required, just access the Swagger UI and interact with the documented endpoints directly from your browser.

However, if you'd rather run the project locally on your own machine, for development or customization, follow the instructions below:

## 🚀 How to Run Locally (via Docker Compose)

### ✅ Requirements

- [Docker](https://www.docker.com/) installed
- [Docker Compose](https://docs.docker.com/compose/) installed

### 🔧 Steps

```bash
git clone https://github.com/your-username/short-url.git

cd short-url
```

### 📄 Create a .env file based on the provided .example.env

### 🛡️ Configure Sentry, not mandatory (tutorial below):

To enable error monitoring with Sentry, follow these steps:

1. Go to [https://sentry.io](https://sentry.io)
2. Create an account or log in.
3. Create a new project.
4. Select **Nest.js** as the platform.
5. After project creation, copy the **DSN** provided by Sentry

Paste the DSN into your `.env` file as shown in `.example.env`.

> **Note:** You can enable or disable Sentry integration at any time by setting the `SENTRY_STATUS` variable in your `.env` file to `on` or `off`.

### ▶️ Start the containers:

```bash
docker compose up
```

## 📚 Available Endpoints (via Swagger)

You can explore all endpoints directly on [Swagger UI](http://44.199.242.110:3333/docs), but here's a quick reference:

### 🔐 Authentication

- `POST /api/users/login` — Login

### 👤 Users

- `POST /api/users` — Register a new user

### 🔗 Shortened URLs

- `POST /api/urls/shorten` — Create a shortened URL
- `GET /:code` — Redirect to the original URL and increment 1 click
- `GET /api/urls` — List all URLs created by logged
- `PATCH /api/urls/:id` — Update the destination URL of an existing shortened link
- `DELETE /api/urls/:id` — Soft delete a shortened URL

Only the authenticated user who created a shortened URL can perform operations on it, such as listing, editing, or soft-deleting. When calling the POST /api/urls/shorten route without being logged in, the shortened URL will not be linked to any user account.

---

## ⚙️ Scaling Considerations

### ⚠️ Main Challenges

- **Click Counter Consistency:**
  - With multiple instances handling GET /:code, concurrent updates to the click count can lead to lost or inconsistent data if not properly synchronized.

- **Race Conditions in Code Generation:**
  - When several instances generate short codes at the same time, there's a risk of creating duplicates due to simultaneous insert attempts, especially under high load.

### 📌 Suggested Improvements for Horizontal Scaling

- **Caching:**
  - Apply cache to all listings.

- **Layered Rate Limiting:**
  - Apply a global rate limiter per IP to avoid abuse.
  - Apply personalized rate limits per authenticated user (e.g., define how many short URLs they can create per hour or per day).

- **Distributed Locking (Redis Leasing):**
  - A Redis-based leasing strategy (`SETNX` with expiry) can be used to temporarily reserve short codes before attempting to save them.
  - This helps coordinate instances in high-concurrency environments and significantly reduces the chance of hitting the database with a code that’s already in use, avoiding redundant insert attempts and database load.

- **Analytics & Metrics Aggregation:**
  - Separate the click tracking logic from the main request cycle by recording clicks asynchronously (e.g., store in Redis).
  - Periodically aggregate and persist the metrics to the database to avoid write pressure on every redirect.

## 🤝 Contributing

Contributions are welcome! 🚀

If you want to improve this project or add new features:

1. Fork this repository
2. Create a new branch:

   ```bash
   git checkout -b my-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m 'feat: added feature'
   ```

4. Push to your branch:

   ```bash
   git push origin my-feature
   ```

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
