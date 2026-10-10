# 🎯 Smart Job Application & Resume Tracker

A full-stack web application to track your entire job search — from wishlist to offer — built with **Java 21 + Spring Boot 3**, **React 18**, **PostgreSQL**, and **Docker**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 **Auth** | JWT-based registration & login, refresh tokens, BCrypt passwords |
| 📋 **Applications** | Full CRUD with 10 statuses, search, filter, pagination |
| 📅 **Timeline** | Applied date, follow-up date, interview date, offer date |
| 🎤 **Interview Stages** | Track each round (phone screen, technical, onsite, etc.) with results |
| 📄 **Resume Manager** | Multiple resume versions, set default, link to applications |
| 📊 **Dashboard** | Stats, charts (bar + pie), response/interview/offer rates |
| ⏰ **Follow-up Alerts** | Dashboard shows overdue follow-ups |
| 🐳 **Docker** | One-command startup with docker-compose |

---

## 🏗️ Tech Stack

### Backend
- **Java 21** — virtual threads ready
- **Spring Boot 3.2** — web, security, data JPA
- **Spring Security + JWT** — stateless auth (jjwt 0.12)
- **MySQL** — primary database (H2 for tests)
- **Hibernate / JPA** — ORM with auditing
- **Lombok** — boilerplate reduction
- **JUnit 5 + Mockito** — unit & integration tests

### Frontend
- **React 18** — functional components, hooks
- **React Router v6** — client-side routing
- **Tailwind CSS** — utility-first styling
- **Recharts** — bar and pie charts
- **React Hook Form** — form state & validation
- **Axios** — HTTP client with JWT interceptor
- **Vite** — fast dev server & bundler

### Infrastructure
- **Docker + Docker Compose** — multi-container orchestration
- **Nginx** — SPA serving + API proxy

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- (For local dev) Java 21, Node.js 20, PostgreSQL

### 1. Clone & configure

```bash
git clone https://github.com/yourname/job-tracker.git
cd job-tracker
cp .env.example .env
# Edit .env with your values
```

### 2. Run with Docker

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| MySQL | localhost:5432 |

### 3. Local development (without Docker)

**Backend:**
```bash
cd backend
# Set env vars or update application.properties
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Proxies /api → localhost:8080
```

---

## 📁 Project Structure

```
job-tracker/
├── backend/                         # Spring Boot application
│   ├── src/main/java/com/jobtracker/
│   │   ├── config/                  # Security, CORS config
│   │   ├── controller/              # REST controllers
│   │   ├── dto/                     # Request/Response DTOs
│   │   ├── entity/                  # JPA entities
│   │   ├── exception/               # Custom exceptions + handler
│   │   ├── repository/              # Spring Data JPA repos
│   │   ├── security/                # JWT filter, UserPrincipal
│   │   └── service/                 # Business logic
│   ├── src/test/                    # JUnit 5 tests
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                        # React application
│   ├── src/
│   │   ├── api/                     # Axios API clients
│   │   ├── components/              # Reusable UI components
│   │   │   ├── applications/        # ApplicationForm
│   │   │   └── common/              # Layout, Badge, StatCard, etc.
│   │   ├── context/                 # AuthContext
│   │   ├── pages/                   # Route pages
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications` | Paginated list (search, filter by status) |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| GET | `/api/applications/dashboard` | Stats & metrics |
| GET | `/api/applications/follow-ups` | Overdue follow-ups |

### Interview Stages
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/applications/:id/stages` | List stages |
| POST | `/api/applications/:id/stages` | Add stage |
| PUT | `/api/applications/:id/stages/:sid` | Update stage |
| DELETE | `/api/applications/:id/stages/:sid` | Delete stage |

### Resumes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/resumes` | List resumes |
| POST | `/api/resumes` | Add resume metadata |
| DELETE | `/api/resumes/:id` | Delete resume |
| PATCH | `/api/resumes/:id/default` | Set as default |

---

## 🧪 Running Tests

```bash
cd backend
./mvnw test
```

Tests use an **H2 in-memory database** (via `application-test.properties`) — no PostgreSQL needed.

---

## 🌱 Application Statuses

```
WISHLIST → APPLIED → PHONE_SCREEN → TECHNICAL_INTERVIEW
       → ONSITE_INTERVIEW → OFFER_RECEIVED → OFFER_ACCEPTED
                                           → OFFER_DECLINED
                         → REJECTED
                         → WITHDRAWN
```

---

## 🔒 Security Notes

- All `/api/applications/**` and `/api/resumes/**` endpoints require a valid JWT Bearer token
- Users can only access their own data (enforced at service layer)
- Passwords are hashed with BCrypt (strength 10)
- JWT secret must be a Base64-encoded string of at least 256 bits (32 bytes)
- Generate a secure secret: `openssl rand -hex 64`

---

## 📦 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_USERNAME` | `Mysql` | MySQL username |
| `DB_PASSWORD` | `Mysql` | MySQL password |
| `JWT_SECRET` | *(insecure default)* | JWT signing secret — **change in production** |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |

---

## 🛠️ Extending the Project

Ideas for next features:
- 📧 Email reminders for follow-ups (Spring Mail + scheduler)
- 🤖 AI resume tailoring suggestions (OpenAI API)
- 📤 CSV/PDF export of applications
- 🏷️ Custom tags and labels
- 🔗 LinkedIn/Indeed job import via URL parsing
- 👥 Team/recruiter sharing mode

---

## 📄 License

MIT — free to use, modify, and distribute.
