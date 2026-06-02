# ⚡ Nexus AI Billing Portal

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 15">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/Prisma-SQLite-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
</p>

<p align="center">
  <i>A sleek, modern, and comprehensive SaaS billing and management portal for AI platforms.</i>
</p>

---

Welcome to the **Nexus AI Billing Portal**, a complete full-stack application designed to handle subscription management, payment processing, API key provisioning, and team collaboration for AI SaaS products. Built with the latest Next.js App Router and a beautifully designed UI, it provides a seamless experience for both developers and business owners.

---

## ✨ Key Features

* **Subscription & Payment Flow:**
    * Interactive pricing cards with monthly/annual toggles.
    * Integrated Razorpay-style payment modal with dynamic pricing calculation.
    * Automated invoice generation and history tracking.
* **API Key Management:** 
    * Generate, view, and securely copy API keys (e.g., live, test, dev).
    * Track granular usage and error rates per key.
* **Comprehensive Analytics:**
    * Real-time charts (via Recharts) displaying daily token usage, queries, and error rates.
    * Endpoint-specific metrics including p95 latency tracking.
* **Team & Access Control:**
    * Role-based access control (Owner, Admin, Developer, Viewer).
    * Functional user switcher to securely mock role-based views.
* **Audit Logs & Security:** 
    * Detailed logging of user actions (plan changes, key rotations, team invites).
    * Export audit logs instantly to CSV.
* **Modern UI/UX:**
    * Dark mode support out of the box.
    * Smooth micro-animations and sleek glassmorphism design.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router) |
| **UI & Styling** | React 19, TailwindCSS 4, Motion |
| **Database & ORM** | SQLite & Prisma |
| **Data Visualization** | Recharts |

---

## 🏛️ Architecture

This project is structured as a **Full-Stack Next.js Application**, utilizing Server Actions and the App Router.

* **Frontend (`app/` & `components/`):** React Server Components (RSC) and Client Components for dynamic, interactive UI.
* **Backend (`app/actions/`):** Next.js Server Actions handle direct database mutations (upgrades, API key creation, team invites) securely without manual API routes.
* **Database Layer (`prisma/`):** A lightweight SQLite database managed by Prisma ORM, enabling easy local development and quick setup.

---

## 🗄️ Database Setup

Nexus AI uses a local **SQLite** database via Prisma for immediate, zero-config development. 

1. Ensure your `.env` contains the database URL:
   ```env
   DATABASE_URL="file:./dev.db"
   ```
2. The initial seed script will automatically generate the schema and populate the database with realistic mock data (users, invoices, analytics, API keys).

---

## 🚀 How to Run

### Prerequisites

1. **Node.js:** Ensure you have Node.js (v18+) installed.

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amalshajimichaelk/Nexus_AI_billing_portal.git
   cd Nexus_AI_billing_portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize the Database:**
   * Generate the Prisma Client and seed the database with mock data:
     ```bash
     npx prisma db push
     npx tsx prisma/seed.ts
     ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   * The app will now be running at `http://localhost:3000`. 

### Explore the Database

To view and edit the SQLite database visually, run:
```bash
npx prisma studio
```

---

## 📂 Project Structure

```
Nexus_AI_billing_portal/
├── app/                  # Next.js App Router pages and Server Actions
│   ├── actions/          # Backend Server Actions (auth, billing, etc.)
│   ├── analytics/        # Analytics dashboard
│   ├── api-keys/         # API key management
│   ├── audit-logs/       # System audit events
│   ├── billing/          # Subscription & payment flow
│   ├── invoices/         # Invoice history
│   ├── team/             # Team member management
│   └── layout.tsx        # Global layout and sidebar
├── components/           # Reusable UI components (theme provider, switchers)
├── prisma/               # Prisma schema and seed script
└── public/               # Static assets
```
