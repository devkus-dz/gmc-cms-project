# 📚 EduCMS Backend API

A robust, secure, and scalable RESTful API built for a modern Content Management System (CMS). This backend handles user authentication, content management (posts, categories, tags), comment moderation, and media file management using Cloud Storage.

Built with **Node.js**, **Express**, and **PostgreSQL (via Supabase)**.

## 🚀 Key Features

* **🔐 Secure Authentication:** Implements **HTTP-Only Cookies** for JWT storage, protecting against XSS attacks.
* **☁️ Cloud Storage:** Integrates **Supabase Storage** for handling image uploads via Multer (Memory Storage).
* **🗄️ PostgreSQL Database:** Uses Supabase's managed Postgres instance with optimized SQL queries.
* **🛡️ Role-Based Access Control (RBAC):** Granular permissions for Admins, Editors, Authors, and Subscribers.
* **💬 Comment System:** Full moderation workflow (Pending -> Approved/Spam).
* **📊 Dashboard Stats:** Aggregated statistics for the admin dashboard in a single query.
* **🧪 API Testing:** Optimized for testing with the **Bruno** API Client.
- **⚡ Advanced Performance:**
  - **Server-Side Caching:** Implements an in-memory caching strategy (Singleton pattern) to reduce database load for high-traffic endpoints like Posts and Comments.
  - **Smart Invalidation:** Automatically flushes cache when content is created, updated, or deleted to ensure data consistency.

- **📧 Email Service:**
  - **Automated Notifications:** scalable email architecture using `Nodemailer`.
  - **Welcome Emails:** Automatically sends greeting emails upon user registration.
  - **Environment Agnostic:** Supports Gmail (Production) and Ethereal (Development) with zero code changes.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Supabase)
* **ORM/Query:** Native `pg` (node-postgres)
* **Caching:** Node Cache
* **Storage:** Supabase Storage Bucket
* **Auth:** JSON Web Tokens (JWT) + Cookie Parser
* **Logging:** Morgan
* **Emails:** Nodemailer
* **Security:** Helmet, CORS, Bcryptjs

---

## ⚙️ Installation & Setup

### 1. Install Dependencies
```Bash
npm install
```

### 2. Database Setup (Supabase)
1. Create a new project on Supabase.

2. Go to the SQL Editor and run your migration script to create tables (users, posts, comments, etc.).

3. Go to Storage, create a public bucket named media, and set the Policy to allow uploads.

4. Important: Enable the "Service Role" key to bypass RLS for backend operations.

### 3. Environment Variables
Create a .env file in the root directory and populate it with your credentials:

```text
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (Transaction Pooler recommended)
DATABASE_URL=postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-ID].supabase.co:6543/postgres

# Security & Authentication
JWT_SECRET=your_super_secret_random_string_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Supabase Storage Configuration
SUPABASE_URL=https://[YOUR-PROJECT-ID].supabase.co
# ⚠️ Use the SERVICE_ROLE key (starts with eyJ...), NOT the Anon key!
SUPABASE_SERVICE_KEY=eyJ.....................
```

### 4. Start the Server
```bash
npm start

```

## 📡 API Endpoints
All routes are prefixed with /api/v1.

| Resource | Method | Endpoint | Description | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Register a new user | Public |
| | `POST` | `/auth/login` | Login (Sets HTTP-Only Cookie) | Public |
| | `GET` | `/auth/logout` | Logout (Clears Cookie) | Public |
| | `GET` | `/auth/me` | Get current logged-in user info | **Protected** (All) |
| **Users** | `GET` | `/users` | Get all users | **Admin** |
| | `PUT` | `/users/profile` | Update own profile | **Protected** (All) |
| **Posts** | `GET` | `/posts` | Get all published posts | Public |
| | `GET` | `/posts/:slug` | Get single post by slug | Public |
| | `POST` | `/posts` | Create a new post | **Admin, Editor, Author** |
| | `PUT` | `/posts/:id` | Update an existing post | **Admin, Editor, Author** |
| | `DELETE` | `/posts/:id` | Delete a post | **Admin, Editor** |
| **Categories** | `GET` | `/categories` | Get all categories | Public |
| | `POST` | `/categories` | Create a new category | **Admin, Editor** |
| | `PUT` | `/categories/:id` | Update a category | **Admin, Editor** |
| **Tags** | `GET` | `/tags` | Get all tags | Public |
| | `POST` | `/tags` | Create a new tag | **Admin, Editor** |
| **Comments** | `GET` | `/comments` | Get all comments (System-wide) | **Admin, Editor** |
| | `GET` | `/comments/post/:postId` | Get approved comments for a post | Public |
| | `POST` | `/comments` | Submit a new comment | **Protected** (All) |
| | `PATCH` | `/comments/:id` | Approve/Reject a comment | **Admin, Editor** |
| **Media** | `POST` | `/media/upload` | Upload image (Multipart Form) | **Protected** (All) |
| | `GET` | `/media` | Get library of uploaded files | **Protected** (All) |
| | `DELETE` | `/media/:id` | Delete file from DB & Cloud | **Admin, Editor** |
| **Stats** | `GET` | `/stats` | Get dashboard counts | **Admin, Editor** |


## 🧪 Testing with Bruno
This API is optimized for Bruno, a fast and open-source API client.

1. **Environment:** Create a Local Dev environment in Bruno with base_url set to http://localhost:5000/api/v1.

2. **Cookie Handling:** * No scripts or manual token pasting are required!

- Simply run the Login request.

- The server responds with a Set-Cookie header containing the JWT.

- Bruno automatically attaches this cookie to all subsequent requests (e.g., GET /users).

3. **File Uploads:**

- Use the Multipart Form body type.

- Set the key to image.

- Select your file and send.

4. **Testing Authentication & Email Flow :**

- Register a New User:
    - Method: `POST`
    - URL: `{{baseUrl}}/auth/register`
    - Body:
      ```json
      {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "password123"
      }
      ```

- Verify Email Delivery:
    - **If using Ethereal (Dev Mode):**
      - Check your **VS Code Terminal** where the server is running.
      - You will see a log: `🔗 Preview URL: https://ethereal.email/message/...`
      - Ctrl+Click that link to view the fake email in your browser.
    - **If using Gmail (Prod Mode):**
      - Check the inbox of the email address you used in the registration body.

- Login:
    - Method: `POST`
    - URL: `{{baseUrl}}/auth/login`
    - Body:
      ```json
      {
        "email": "testuser@example.com",
        "password": "password123"
      }
      ```

