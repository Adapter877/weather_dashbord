# Next.js Keycloak Weather Dashboard 🌦️

A modern, dark-themed Weather Dashboard built with **Next.js 15**, secured by **Keycloak SSO**, and powered by the **Bun** runtime.

![Dashboard Preview](https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=1000)
*(Note: Replace with actual screenshot)*

## ✨ Features

- **🔐 Secure Authentication**: Enterprise-grade SSO using Keycloak (OIDC) via `next-auth`.
- **🌑 Dark UI**: Beautiful glassmorphism design with a deep slate/blue color palette.
- **📍 Geolocation Support**: Automatically detects user location to show local weather.
- **🌤️ Real-time Weather**: Integration with [OpenMeteo API](https://open-meteo.com/) (No API key required).
- **📈 Detailed Analytics**: 24-hour interactive temperature forecast graph using Recharts.
- **⚡ Bun Runtime**: Optimized for speed using Bun package manager and runtime.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Auth**: NextAuth.js (Auth.js) v5 + Keycloak
- **Styling**: Tailwind CSS + Lucide Icons
- **Charts**: Recharts
- **Infrastructure**: Docker & Docker Compose (for Keycloak + Postgres)

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Bun](https://bun.sh/) (`curl -fsSL https://bun.sh/install | bash`)

### 1. Start Infrastructure

Start the Keycloak authentication server and PostgreSQL database:

```bash
docker-compose up -d
```

- **Keycloak Console**: `http://localhost:8080`
- **Default Admin**: `admin` / `admin`

### 2. Configure Keycloak

1.  Log in to the Keycloak Admin Console.
2.  Create a Realm named `ohm` (or match `KEYCLOAK_ISSUER` in `.env.local`).
3.  Create a Client ID: `nextjs-app`.
4.  Set **Front-channel logout** to `ON`.
5.  Set **Valid Redirect URIs**: `http://localhost:3000/api/auth/callback/keycloak`.
6.  Set **Web Origins**: `+`.
7.  Go to **Credentials** tab and copy the **Client Secret**.

### 3. Environment Setup

Create `.env.local` in the root directory:

```bash
KEYCLOAK_CLIENT_ID=nextjs-app
KEYCLOAK_CLIENT_SECRET=your_copied_secret_here
KEYCLOAK_ISSUER=http://localhost:8080/realms/ohm
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

### 4. Install & Run

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📂 Project Structure

```
├── app/
│   ├── api/auth/      # NextAuth routes
│   ├── components/    # UI Components (WeatherChart, LocationRequester)
│   ├── lib/          # API services (weather.ts)
│   ├── page.tsx      # Main Dashboard
│   └── layout.tsx    # Root layout
├── auth.ts           # NextAuth configuration
├── docker-compose.yml # Infrastructure setup
└── public/
```
