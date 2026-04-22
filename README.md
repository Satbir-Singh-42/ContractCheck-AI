# ContractCheck AI

AI-powered contract compliance checker that analyzes legal documents against Indian regulations including the DPDP Act 2023, GST/CGST Act, Indian Contract Act 1872, and Labour Laws.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture (FastAPI)](#backend-architecture-fastapi)
- [AI/RAG Pipeline](#airag-pipeline)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Payment Integration](#payment-integration)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Legal Disclaimer](#legal-disclaimer)

---

## Overview

ContractCheck AI is a full-stack legal compliance platform designed for Indian businesses. Users upload contracts (PDF, DOCX, DOC, TXT), and the AI engine analyzes each clause against Indian regulations, producing a detailed compliance report with risk scores, issue identification, and AI-generated fix suggestions.

**Target Users:**
- Startups (vendor contracts, DPDP compliance, investor agreements)
- Law Firms (bulk contract screening, client-ready PDF reports)
- Enterprises (procurement review, GST validation, audit readiness)
- HR Teams (employment contracts, labour law compliance)
- Finance Teams (payment terms, GST invoice requirements, ITC checks)
- Compliance Officers (data protection audits, cross-border data flow)

**Regulations Covered:**
| Regulation | Key Areas |
|---|---|
| DPDP Act 2023 | Consent, Data Fiduciary roles, third-party sharing, breach notification |
| GST / CGST Act 2017 | GSTIN mandates, ITC eligibility, reverse charge, tax-exclusive clauses |
| Indian Contract Act 1872 | Void clauses (Sec 23-30), non-compete (Sec 27), jurisdiction, arbitration |
| Labour Laws / Labour Codes 2020 | Working hours, overtime, gratuity, employee benefits, termination |
| IT Act 2000 | Digital signatures, electronic records, cyber offences |
| Arbitration Act 1996 | Arbitration clause validity, seat vs venue, institutional rules |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tailwind CSS v4 | Utility-first styling |
| React Router v7 | Client-side routing (Data mode with `createBrowserRouter`) |
| Motion (Framer Motion) | Animations and transitions |
| pdfmaker | Client-side PDF report generation |
| Lucide React | Icon library |
| Radix UI | Accessible UI primitives |

### Backend (to be connected)
| Technology | Purpose |
|---|---|
| Python 3.11+ | Backend language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| PostgreSQL | Primary database |
| SQLAlchemy / Tortoise ORM | Database ORM |
| Alembic | Database migrations |
| Redis | Caching, job queue |
| Celery | Async task processing |

### AI / ML Stack
| Technology | Purpose |
|---|---|
| OpenAI GPT-4 / GPT-4o | LLM for clause analysis and recommendation generation |
| LangChain | RAG pipeline orchestration |
| FAISS | Vector similarity search for legal text retrieval |
| OpenAI Embeddings (text-embedding-3-small) | Document/chunk embedding |
| PyPDF2 / python-docx | Document parsing (PDF, DOCX) |
| tiktoken | Token counting for context window management |

---

## Project Structure

```
/
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── App.tsx             # Root component with RouterProvider
│   │   ├── routes.tsx          # All route definitions (public + protected)
│   │   ├── components/
│   │   │   ├── AppLayout.tsx   # Authenticated app shell (navbar + mobile menu)
│   │   │   ├── PublicNavbar.tsx # Shared navbar for public pages (with mobile hamburger)
│   │   │   ├── ProtectedRoute.tsx # Auth guard wrapper
│   │   │   └── ui/            # Radix-based UI primitives (button, dialog, etc.)
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Auth state, user profile, localStorage persistence
│   │   └── pages/
│   │       ├── LandingPage.tsx # Public landing with hero, features, CTA
│   │       ├── AboutPage.tsx   # Company info, capabilities, use cases, regulations
│   │       ├── PricingPage.tsx # Free / Pro / Enterprise tiers
│   │       ├── ContactPage.tsx # Contact form
│   │       ├── PrivacyPage.tsx # Privacy policy
│   │       ├── LoginPage.tsx   # Email/password login
│   │       ├── SignupPage.tsx  # Registration
│   │       ├── DashboardPage.tsx # Report history with search/filter
│   │       ├── UploadPage.tsx  # File upload with drag-and-drop, 3-column feature grid
│   │       ├── ProcessPage.tsx # Analysis progress with step indicators
│   │       ├── ResultPage.tsx  # Full compliance report with PDF export
│   │       ├── SharePage.tsx   # Public shareable report view
│   │       ├── ProfilePage.tsx # User profile with photo upload
│   │       ├── PaymentPage.tsx # Razorpay payment integration
│   │       ├── SuccessPage.tsx # Payment success confirmation
│   │       └── FailurePage.tsx # Payment failure handling
│   ├── lib/
│   │   ├── schema.ts          # Database types + API request/response interfaces
│   │   ├── api.ts             # Mock API service layer (mirrors FastAPI endpoints)
│   │   ├── mockData.ts        # Sample contract reports with clauses
│   │   └── utils.ts           # Utility functions (cn helper)
│   └── styles/
│       ├── index.css           # Global styles entry
│       ├── tailwind.css        # Tailwind directives
│       ├── theme.css           # Design tokens
│       └── fonts.css           # Font imports
├── vercel.json                 # Vercel SPA rewrite config
├── vite.config.ts              # Vite configuration
└── package.json
```

---

## Frontend Architecture

### Routing

Uses React Router v7 Data mode (`createBrowserRouter`). Routes are split into:

- **Public routes:** `/`, `/about`, `/pricing`, `/contact`, `/privacy`, `/login`, `/signup`, `/share/:reportId`
- **Protected routes:** `/dashboard`, `/upload`, `/process/:id`, `/result/:id`, `/payment`, `/success`, `/failure`, `/profile`

Protected routes are wrapped in a `ProtectedRoute` component that checks `AuthContext` and redirects to `/login` if unauthenticated.

### Authentication

`AuthContext` manages user state with localStorage persistence:
- Login/signup store a mock JWT token and user object
- Profile photo is stored as a base64 data URL in localStorage
- Logout clears state and redirects to `/` (landing page)

### PDF Export

The ResultPage generates professional PDF reports using pdfmaker with:
- Dark gradient header with branding
- Score ring badge with color-coded risk indicator
- Summary stats in colored boxes (Safe/Risky/Non-compliant)
- Segmented compliance bar
- Clause cards with colored left accent bars and risk badge pills
- Original clause quote boxes with left border accent
- Issues listed with colored bullets
- AI recommendations with numbered indicators
- Regulations referenced section
- Legal disclaimer
- Automatic page breaks with page numbering
- Page footer with branding on every page

### Responsive Design

All pages are fully responsive:
- PublicNavbar and AppLayout both have mobile hamburger menus
- Grid layouts collapse from multi-column to single-column on mobile
- Text sizes scale down on smaller screens
- Filter tabs show abbreviated labels on mobile
- Touch-friendly tap targets throughout

---

## Backend Architecture (FastAPI)

The backend is designed as a Python FastAPI application. The frontend's mock API layer (`/src/lib/api.ts`) mirrors the exact endpoint structure for seamless integration.

### Recommended Backend File Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app initialization, CORS, middleware
│   ├── config.py               # Environment variable loading (Pydantic Settings)
│   ├── database.py             # PostgreSQL connection, session management
│   ├── models/
│   │   ├── user.py             # User SQLAlchemy model
│   │   ├── report.py           # Report model
│   │   ├── clause.py           # Clause model with issues & suggestions
│   │   ├── payment.py          # Payment/subscription model
│   │   └── shared_report.py    # Shared report links model
│   ├── schemas/
│   │   ├── auth.py             # LoginRequest, SignupRequest, AuthResponse
│   │   ├── report.py           # UploadResponse, ReportResponse, etc.
│   │   └── payment.py          # PaymentCreateResponse, etc.
│   ├── routers/
│   │   ├── auth.py             # POST /auth/login, /auth/signup
│   │   ├── reports.py          # POST /reports/upload, GET /reports, GET /reports/:id
│   │   ├── share.py            # POST /reports/:id/share, GET /shared/:token
│   │   ├── payments.py         # POST /payments/create-order, /payments/verify
│   │   └── user.py             # GET /user/profile, PUT /user/profile
│   ├── services/
│   │   ├── auth_service.py     # Password hashing (bcrypt), JWT creation/validation
│   │   ├── analysis_service.py # Orchestrates the AI analysis pipeline
│   │   ├── document_parser.py  # Extracts text from PDF/DOCX/DOC/TXT
│   │   ├── rag_service.py      # LangChain RAG pipeline (see AI section)
│   │   ├── report_service.py   # Builds structured report from AI output
│   │   └── payment_service.py  # Razorpay order creation & verification
│   ├── ai/
│   │   ├── embeddings.py       # OpenAI embedding generation
│   │   ├── vector_store.py     # FAISS index management
│   │   ├── prompts.py          # System/user prompt templates
│   │   ├── chain.py            # LangChain chain definitions
│   │   └── regulations/        # Pre-embedded regulation text chunks
│   │       ├── dpdp_act.json
│   │       ├── gst_act.json
│   │       ├── contract_act.json
│   │       └── labour_laws.json
│   ├── workers/
│   │   └── analysis_worker.py  # Celery task for async contract analysis
│   └── utils/
│       ├── jwt.py              # JWT encode/decode (PyJWT)
│       └── file_handler.py     # Temp file storage, cleanup
├── alembic/                    # Database migrations
├── requirements.txt
├── Dockerfile
└── docker-compose.yml          # PostgreSQL + Redis + FastAPI + Celery
```

### Key Backend Implementation Details

**CORS Configuration (main.py):**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ContractCheck AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**JWT Authentication:**
```python
# Uses PyJWT with HS256 algorithm
# Token includes: user_id, email, plan, exp (24h default)
# Middleware extracts token from Authorization: Bearer <token>
```

**File Upload Handling:**
```python
@router.post("/reports/upload")
async def upload_contract(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # 1. Validate file type (pdf, docx, doc, txt)
    # 2. Check user upload quota (free: 3, pro: unlimited)
    # 3. Save to temp storage
    # 4. Create report record (status: 'processing')
    # 5. Dispatch Celery task for async analysis
    # 6. Return report_id + estimated time
```

---

## AI/RAG Pipeline

The core analysis engine uses a Retrieval-Augmented Generation (RAG) architecture:

### Pipeline Steps

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. Document  │────>│ 2. Clause    │────>│ 3. Embedding │
│    Parsing   │     │    Extraction│     │    Generation│
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  v
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 6. Report    │<────│ 5. GPT-4     │<────│ 4. FAISS     │
│    Assembly  │     │    Analysis  │     │    Retrieval  │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Step 1: Document Parsing
```python
# PyPDF2 for PDF, python-docx for DOCX, plain read for TXT
# Extracts raw text while preserving paragraph structure
# Handles multi-page documents, tables, headers/footers
```

### Step 2: Clause Extraction
```python
# Uses GPT-4 to identify individual clauses from raw text
# Prompt: "Extract all distinct contractual clauses from this document.
#          For each clause, provide: title, original text, category."
# Output: List of structured clause objects
```

### Step 3: Embedding Generation
```python
# Each clause is embedded using OpenAI text-embedding-3-small (1536 dimensions)
# Regulation sections are pre-embedded and stored in FAISS index
# tiktoken used to ensure chunks fit within token limits
```

### Step 4: FAISS Retrieval
```python
# For each clause embedding, retrieve top-k most relevant regulation sections
# Searches across all supported regulations (DPDP, GST, Contract Act, Labour Laws)
# Returns relevant law sections with section numbers and full text
# Typical k=5 for comprehensive coverage
```

### Step 5: GPT-4 Analysis
```python
# Each clause is analyzed with its retrieved regulation context
# System prompt defines the analysis framework:

SYSTEM_PROMPT = """
You are a legal compliance analyst specializing in Indian law.
Analyze the given contract clause against the provided regulation sections.

For each clause, determine:
1. Risk Level: "Safe" | "Risky" | "Non-compliant"
2. Issues: List specific compliance problems found
3. Suggestions: Actionable recommendations to fix issues
4. Relevant Law: The most applicable regulation section

Risk Level Criteria:
- Safe: Clause is compliant with all applicable regulations
- Risky: Clause has potential issues or ambiguities that could lead to non-compliance
- Non-compliant: Clause directly violates or contradicts a regulation

Always cite specific sections (e.g., "Section 7(1) of DPDP Act 2023").
"""
```

### Step 6: Report Assembly
```python
# Aggregates all clause analyses into a structured report
# Calculates overall compliance score: 100 - (non_compliant * 25) - (risky * 10)
# Determines overall risk: High (score < 50), Medium (50-79), Low (80+)
# Stores in database with all clauses, issues, and suggestions
```

### LangChain Integration

```python
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# Initialize components
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
llm = ChatOpenAI(model="gpt-4o", temperature=0.1)

# Load pre-built FAISS index with regulation embeddings
vector_store = FAISS.load_local("./regulations_index", embeddings)

# Create retrieval chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vector_store.as_retriever(search_kwargs={"k": 5}),
    return_source_documents=True,
)
```

### Regulation Knowledge Base

Each regulation is pre-processed into chunks:

```python
# Example: DPDP Act 2023 chunk
{
    "law_name": "DPDP Act 2023",
    "section_number": "Section 7",
    "section_title": "Notice and Consent",
    "summary": "Data Fiduciary must give notice and obtain consent before processing personal data",
    "full_text": "...(full section text)...",
    "keywords": ["consent", "notice", "data fiduciary", "personal data", "processing"]
}
```

Pre-embedded regulation files are stored in `/backend/app/ai/regulations/` as JSON files and loaded into FAISS at startup.

---

## Database Schema

Defined in `/src/lib/schema.ts`. The PostgreSQL schema:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    uploads_used INTEGER DEFAULT 0,
    uploads_limit INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) CHECK (file_type IN ('pdf', 'docx', 'doc', 'txt')),
    file_size_bytes INTEGER,
    contract_type VARCHAR(100),
    parties VARCHAR(500),
    overall_risk VARCHAR(10) CHECK (overall_risk IN ('High', 'Medium', 'Low')),
    compliance_score INTEGER CHECK (compliance_score BETWEEN 0 AND 100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Clauses table
CREATE TABLE clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    original_text TEXT NOT NULL,
    risk_level VARCHAR(20) CHECK (risk_level IN ('Safe', 'Risky', 'Non-compliant')),
    relevant_law VARCHAR(500),
    order_index INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clause issues
CREATE TABLE clause_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clause_id UUID REFERENCES clauses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    order_index INTEGER
);

-- Clause suggestions
CREATE TABLE clause_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clause_id UUID REFERENCES clauses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    suggested_text TEXT,
    order_index INTEGER
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount_inr INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    plan VARCHAR(20) CHECK (plan IN ('pro', 'enterprise')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared reports
CREATE TABLE shared_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    shared_by_user_id UUID REFERENCES users(id),
    share_token VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_clauses_report_id ON clauses(report_id);
CREATE INDEX idx_shared_reports_token ON shared_reports(share_token);
CREATE INDEX idx_payments_user_id ON payments(user_id);
```

---

## API Endpoints

All endpoints are prefixed with `/api/v1`. The mock API layer in `/src/lib/api.ts` mirrors these exactly.

### Authentication
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/login` | Login with email/password, returns JWT + user | No |
| POST | `/auth/signup` | Register new user, returns JWT + user | No |

### Reports
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/reports/upload` | Upload contract file for analysis | Yes |
| GET | `/reports` | List user's reports (paginated) | Yes |
| GET | `/reports/:id` | Get full report with clauses, issues, suggestions | Yes |
| GET | `/reports/:id/status` | Poll analysis progress | Yes |

### Sharing
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/reports/:id/share` | Generate shareable link | Yes |
| GET | `/shared/:token` | Access shared report (public) | No |

### Payments
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/payments/create-order` | Create Razorpay order for plan upgrade | Yes |
| POST | `/payments/verify` | Verify Razorpay payment signature | Yes |

### User
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/user/profile` | Get current user profile | Yes |
| PUT | `/user/profile` | Update name/email | Yes |

---

## Authentication Flow

```
1. User submits email + password
2. Frontend calls POST /api/v1/auth/login
3. Backend validates credentials (bcrypt compare)
4. Backend generates JWT (PyJWT, HS256, 24h expiry)
5. Frontend stores token in localStorage
6. All subsequent API calls include: Authorization: Bearer <token>
7. Backend middleware validates JWT on protected routes
8. On logout: frontend clears localStorage, redirects to /
```

---

## Payment Integration

ContractCheck AI uses Razorpay for payment processing:

```
1. User selects plan (Pro: 999 INR/mo, Enterprise: 4999 INR/mo)
2. Frontend calls POST /payments/create-order with plan
3. Backend creates Razorpay order via Razorpay API
4. Frontend opens Razorpay checkout modal with order_id
5. User completes payment in Razorpay
6. Razorpay sends payment_id + signature to frontend
7. Frontend calls POST /payments/verify with order_id, payment_id, signature
8. Backend verifies signature using Razorpay secret
9. On success: upgrade user plan, redirect to /success
10. On failure: redirect to /failure
```

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Vercel auto-detects Vite project
4. Build settings (auto-configured):
   - **Framework Preset:** Vite
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
5. The `vercel.json` file handles SPA routing with the rewrite rule:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
6. Set environment variables in Vercel dashboard if connecting to real backend

### Backend (recommended)

| Platform | Setup |
|---|---|
| Railway | One-click deploy with `Dockerfile` |
| AWS EC2 / ECS | Docker container with `docker-compose.yml` |
| DigitalOcean App Platform | Connect GitHub repo, auto-deploy |
| Render | Free tier available for FastAPI |

### Docker Compose (Backend)

```yaml
version: "3.8"
services:
  api:
    build: ./backend
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [db, redis]

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: contractcheck
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine

  celery_worker:
    build: ./backend
    command: celery -A app.workers worker -l info
    env_file: .env
    depends_on: [db, redis]

volumes:
  pgdata:
```

---

## Environment Variables

### Frontend (Vercel)
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Supabase Edge Function (Gemini)
Set these as Supabase Function Secrets (Project Settings -> Secrets) for `analyze-contract`:
```env
SERVICE_ROLE_KEY=eyJhbGciOi...
GEMINI_API_KEY=AIzaSy...
# Optional
GEMINI_MODEL=gemini-1.5-flash
# Optional: paste your 4 foundational legal docs / summaries here
FOUNDATION_DOCS="..."
```

### Backend
```env
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/contractcheck

# JWT
JWT_SECRET_KEY=your-256-bit-secret
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# OpenAI
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Redis (for Celery)
REDIS_URL=redis://redis:6379/0

# CORS
FRONTEND_URL=https://your-frontend.vercel.app

# File Storage
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=pdf,docx,doc,txt
```

---

## Getting Started

### Frontend Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Connecting to Real Backend

1. Deploy the FastAPI backend (see Backend Architecture section)
2. Update `BASE_URL` in `/src/lib/api.ts`:
   ```typescript
   const BASE_URL = 'https://your-api-domain.com/api/v1';
   ```
3. Remove `await delay()` calls and mock responses in each API function
4. Uncomment the actual `fetch()` calls (commented in each function)
5. Set `VITE_API_BASE_URL` environment variable in Vercel

### Backend Setup (Python)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install fastapi uvicorn[standard] sqlalchemy alembic psycopg2-binary \
            python-jose[cryptography] passlib[bcrypt] python-multipart \
            langchain langchain-openai faiss-cpu openai tiktoken \
            PyPDF2 python-docx celery[redis] razorpay pydantic-settings

# Run database migrations
alembic upgrade head

# Build FAISS index from regulation documents
python -m app.ai.build_index

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Start Celery worker (separate terminal)
celery -A app.workers worker -l info
```

---

## Legal Disclaimer

ContractCheck is an AI tool and does not provide legal advice. The analysis is generated by artificial intelligence and may contain errors or omissions. Always consult a qualified advocate for legal matters. ContractCheck AI is not liable for any decisions made based on the reports generated by this platform.
