# LuxeLaptops - Premium E-commerce Platform

A high-performance, minimalist e-commerce application built with Next.js 15, MongoDB, and Tailwind CSS v4.

## Features
- **Modern UI/UX**: Glassmorphism, premium animations, and dark mode.
- **Full-Stack**: Next.js App Router with MongoDB backend.
- **Authentication**: Secure login/signup via NextAuth.
- **Admin Panel**: Product management (Create, Read, Delete).
- **Shopping Cart**: Real-time state management.

## Getting Started (Local Deployment)

Follow these steps to run the project locally.

### 1. Prerequisites
- **Node.js**: v18 or later.
- **MongoDB**: Ensure you have a running MongoDB instance (local or Atlas).

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/next-ecommerce
NEXTAUTH_SECRET=your_super_secret_key_change_this
NEXTAUTH_URL=http://localhost:3000
```

### 3. Installation
Install dependencies:

```bash
npm install
```

### 4. Database Seeding
Populate the database with dummy products and users:
1. Run the dev server: `npm run dev`
2. Visit: [http://localhost:3000/api/seed](http://localhost:3000/api/seed)
3. You should see `{"message": "Database seeded successfully"}`.

### 5. Running in Development
To start the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 6. Production Build (Local "Deployment")
To run the production-optimized build locally:

```bash
# Build the application
npm run build

# Start the production server
npm start
```
The app will run on port 3000.

## Demo Credentials
- **Admin**: `admin@example.com` / `123`
- **User**: `user@example.com` / `123`

## Admin Access
Log in with the admin account and navigate to `/admin` to manage inventory.
