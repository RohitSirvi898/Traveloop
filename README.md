# ✈️ Traveloop

**Plan incredible trips, manage budgets, build itineraries, and travel with confidence — all in one beautiful platform.**

Traveloop is a full-stack travel planning web application built with **Next.js 16**, **Prisma**, **PostgreSQL (Neon)**, and **Clerk Authentication**. It provides a premium, modern interface for organizing every aspect of your trips — from destination discovery to day-by-day itineraries, expense tracking, packing checklists, and travel journals.

---

## 🌟 Features

### 🗺️ Dashboard & Trip Management
- **Personalized Dashboard** — Overview of upcoming trips, budget highlights, and recommended destinations at a glance.
- **Trip CRUD** — Create, view, update, and delete trips with cover images, date ranges, and descriptions.
- **Multi-Stop Itineraries** — Plan trips spanning multiple cities, each with their own date range and budget.

### 📅 Itinerary Builder
- **Day-by-Day Timeline** — Organize activities (transport, lodging, sightseeing, food) across each stop with start/end times.
- **Activity Management** — Add, edit, and remove activities with cost tracking per item.

### 💰 Budget & Expense Tracking
- **Trip Budgets** — Set an overall budget per trip and monitor spending against it.
- **Itemized Expenses** — Log expenses by category (Food, Transport, Accommodation, etc.) with quantity and unit cost.
- **Visual Progress** — Budget utilization bar on the dashboard shows total spend vs. total budget.

### 🌍 Destination Explorer
- **Curated Destinations** — Browse a global catalog of destinations with images, region tags, cost indices ($, $$, $$$), and daily budget estimates.
- **Activity Suggestions** — Each destination comes with pre-loaded activities (Culture, Scenic, Food, Transport) including duration and estimated cost.
- **Save & Bookmark** — Save your favorite destinations for future trips.

### ✅ Packing Checklist
- **Categorized Items** — Organize packing items by category (Essentials, Clothing, Electronics, etc.).
- **Pack/Unpack Toggle** — Mark items as packed with a single click.

### 📓 Travel Journal
- **Trip Notes** — Write journal entries tied to specific trips with titles, location tags, and rich text content.

### 👤 User Profile & Settings
- **My Account** — View and update personal info (name, city, country, photo).
- **Settings** — Configure language, timezone, and saved destinations.

### 🛡️ Admin Panel
- **Admin Stats** — View platform-wide statistics (total users, trips, destinations).

### 🔐 Authentication
- **Clerk Integration** — Secure sign-up / sign-in with Clerk, including social login support.
- **Protected Routes** — Sidebar and user-specific data are only shown to authenticated users.

---

## 🛠️ Tech Stack

| Layer            | Technology                                                       |
| ---------------- | ---------------------------------------------------------------- |
| **Framework**    | [Next.js 16](https://nextjs.org/) (App Router)                  |
| **Language**     | TypeScript                                                       |
| **Styling**      | Tailwind CSS v4                                                  |
| **UI Components**| [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Animations**   | [Framer Motion](https://www.framer.com/motion/)                  |
| **Icons**        | [Lucide React](https://lucide.dev/)                              |
| **Auth**         | [Clerk](https://clerk.com/)                                      |
| **Database**     | PostgreSQL ([Neon](https://neon.tech/) serverless)               |
| **ORM**          | [Prisma](https://www.prisma.io/) v7                              |
| **State**        | [Zustand](https://zustand-demo.pmnd.rs/)                        |
| **Notifications**| [Sonner](https://sonner.emilkowal.dev/) toast library            |
| **Date Utils**   | [date-fns](https://date-fns.org/)                                |

---

## 📁 Project Structure

```
Traveloop/
├── prisma/
│   ├── schema.prisma          # Database models & relations
│   └── seed.ts                # Seed script for global destinations
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/               # REST API routes
│   │   │   ├── activities/    # Activity CRUD
│   │   │   ├── admin/stats/   # Admin statistics
│   │   │   ├── checklist/     # Packing checklist
│   │   │   ├── destinations/  # Global destinations catalog
│   │   │   ├── expenses/      # Expense tracking
│   │   │   ├── itinerary/     # Itinerary management
│   │   │   ├── notes/         # Trip journal notes
│   │   │   ├── profile/       # User profile
│   │   │   ├── seed/          # Auto-seed demo data
│   │   │   ├── stops/         # Trip stops CRUD
│   │   │   └── trips/         # Trip CRUD
│   │   ├── activities/        # Activities page
│   │   ├── admin/             # Admin dashboard
│   │   ├── bookings/          # Bookings page
│   │   ├── dashboard/         # Main dashboard
│   │   ├── expenses/          # Expenses page
│   │   ├── explore/           # Explore destinations
│   │   ├── journal/           # Travel journal
│   │   ├── my-account/        # User profile page
│   │   ├── my-trips/          # All trips listing
│   │   ├── settings/          # User settings
│   │   ├── shared/            # Shared/public trips
│   │   ├── sign-in/           # Clerk sign-in
│   │   ├── sign-up/           # Clerk sign-up
│   │   ├── support/           # Support page
│   │   ├── trips/             # Trip detail & creation
│   │   │   ├── create/        # New trip form
│   │   │   └── [id]/          # Trip detail view
│   │   │       ├── build/     # Trip itinerary builder
│   │   │       └── checklist/ # Trip checklist
│   │   ├── layout.tsx         # Root layout with Clerk & Sidebar
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── layout/            # Sidebar, SidebarWrapper
│   │   ├── ui/                # shadcn/ui primitives (Button, Badge, Sonner)
│   │   └── TripCard.tsx       # Reusable trip card component
│   └── lib/
│       ├── database/prisma/   # Prisma client singleton
│       ├── actions.ts         # Server actions
│       ├── admin.ts           # Admin utilities
│       └── utils.ts           # General utilities
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn / pnpm)
- A **PostgreSQL** database (e.g., [Neon](https://neon.tech/) free tier)
- A **Clerk** account for authentication ([clerk.com](https://clerk.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Traveloop.git
cd Traveloop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

> Refer to [AUTH_SETUP.md](./AUTH_SETUP.md) for detailed Clerk configuration instructions.

### 4. Set Up the Database

```bash
# Generate the Prisma client
npx prisma generate

# Push the schema to your database
npx prisma db push

# (Optional) Seed global destinations
npx tsx prisma/seed.ts
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will auto-seed demo trip data on first sign-in if no trips exist.

---

## 📦 Available Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start the development server             |
| `npm run build`    | Create an optimized production build     |
| `npm run start`    | Start the production server              |
| `npm run lint`     | Run ESLint                               |
| `npx prisma studio`| Open Prisma Studio to browse your data  |

---

## 🗄️ Database Schema

The application uses **8 models** with the following relationships:

```
User ──< Trip ──< Stop ──< Activity
                  │
                  ├──< Expense
                  ├──< TripNote
                  └──< ChecklistItem

GlobalDestination ──< GlobalActivity
```

- **User** → has many **Trips**
- **Trip** → has many **Stops**, **Expenses**, **TripNotes**, **ChecklistItems**
- **Stop** → has many **Activities** (with type: Transport, Lodging, Activity)
- **GlobalDestination** → has many **GlobalActivities** (curated catalog)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ for travelers everywhere
</p>
