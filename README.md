# PayGuard – Payment Tracking and Verification System

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Admin Credentials](#admin-credentials)
- [Live Demo](#live-demo)
- [Future Enhancements](#future-enhancements)

---

## Overview

**PayGuard** is a secure payment tracking and verification system. It allows users to create and track payment requests, while admins can manage these requests, review uploaded documents, and update statuses. The project is designed for robust role-based access control and provides an intuitive dashboard for payment management.

---

## Features

### User Authentication

- Signup, login, and logout using Supabase Auth.
- Role-based access (`Admin` and `User`).

### Payment Management

- **Users:**
  - Create payment requests with title, amount, and status.
  - Upload identity verification documents (PDF/JPG/PNG).
  - Track the status of payment requests (Pending, Approved, Rejected).
- **Admins:**
  - View all payment requests submitted by users.
  - Approve or reject payment requests.
  - Review uploaded documents and update verification status.

### Admin Dashboard

- Summary of total payments and breakdown by status.
- Filters for easy management by date and status.

### Additional Features

- Responsive UI using Tailwind CSS.
- Role-based routing and data access.
- Deployment on Vercel for live access.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, TypeScript.
- **Backend:** Next.js API Routes.
- **Database:** PostgreSQL (Supabase).
- **Storage:** Supabase Storage for document uploads.
- **Deployment:** Vercel.

---

## Getting Started

### Prerequisites

1. Node.js installed on your system.
2. A Supabase project configured with:
   - Supabase Auth enabled.
   - PostgreSQL database set up with required tables.
   - Supabase Storage for handling file uploads.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/payguard.git
   cd payguard
   ```
