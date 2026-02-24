# EduCMS - Frontend Client

A modern, lightning-fast, and highly responsive frontend client for **EduCMS**—a content management system built specifically for developers to publish, manage, and share coding tutorials and tech insights.

This frontend is powered by the newest Next.js App Router, styled with Tailwind CSS v4, and utilizes Shadcn UI for accessible, beautiful components.

## ✨ Key Features

### Public Developer Blog
* **High-Conversion Landing Page:** Includes a responsive Hero section, Trusted By banner, Key Features, Testimonials, and a premium Call-to-Action.
* **Dynamic Blog Grid:** Features instant, client-side category filtering without page reloads for a seamless browsing experience.
* **Rich Text Articles:** Beautifully formatted blog posts utilizing the official Tailwind Typography (`prose`) plugin.
* **Interactive Engagement:** Real-time view counters, asynchronous "likes" system, and a community comment submission engine.
* **Mobile-First Navigation:** Fully responsive top navigation utilizing Shadcn slide-out Sheets for mobile devices.

### CMS Dashboard (Admin & Author)
* **Role-Based Access Control (RBAC):** Distinct UI layouts and permissions for `Admins` and `Authors`.
* **Full Content Management:** Interfaces to create, read, update, and delete blog posts and categories.
* **Media Handling:** Seamless integration for uploading featured images to the cloud.
* **Comment Moderation:** A dedicated moderation queue UI for admins to approve or reject community comments.
* **Analytics Interface:** Visual tracking of article views, likes, and engagement metrics directly from the dashboard.

---

## 💻 Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
* **Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **UI Components:** [Shadcn/UI](https://ui.shadcn.com/) (Radix UI primitives)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Data Fetching:** Fetch API with Next.js Server & Client Components

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) installed on your machine. You will also need the EduCMS Backend API running locally or deployed to the cloud.

### 1. Installation
Clone the repository and navigate to the frontend directory:

```bash
cd frontend
npm install
```

### 2. Environment Variables
Create a .env.local file in the root of the frontend directory. You need to point the frontend to your backend API:

```bash
# Point this to your local backend server, or your deployed Render URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```

### 3. Run the Development Server
Start the Turbopack development server:

```Bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.
