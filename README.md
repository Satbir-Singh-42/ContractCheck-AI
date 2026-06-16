# ContractCheck AI

AI-powered contract compliance checker that analyzes legal documents against 8 major Indian regulations including the DPDP Act 2023, CGST Act 2017, Indian Contract Act 1872, and Labour Codes 2020.

---

## 🚀 Quick Start — Make It Fully Functional

This project is **fully built**. You only need to configure credentials and deploy edge functions. Follow these 5 steps.

---

### ✅ Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your credentials from **Project Settings → API**:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon (public)` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key (keep secret) → used as `SERVICE_ROLE_KEY` in edge function secrets
3. Go to **SQL Editor** and run the full schema from `Supabase schema Complete.sql` in this repo
4. Go to **Storage** → Create two buckets:
   - `contracts` (private)
   - `avatars` (public)

---

### ✅ Step 2 — Configure Environment Variables

Create a `.env` file in the project root (or use `.env.local`):

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> ⚠️ Never put `SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, or `RAZORPAY_KEY_SECRET` in your `.env` file.  
> These are secrets — set them only in Supabase (see Step 3).

---

### ✅ Step 3 — Set Supabase Edge Function Secrets

In your terminal (with [Supabase CLI](https://supabase.com/docs/guides/cli) installed and logged in):

```bash
# Required: Supabase admin key for edge functions to write to DB
supabase secrets set SERVICE_ROLE_KEY=eyJhbGciOi...

# Required: Your Gemini API key from Google AI Studio (free at aistudio.google.com)
supabase secrets set GEMINI_API_KEY=AIzaSy...

# Required for payments: Razorpay keys (test keys work for development)
supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxx
supabase secrets set RAZORPAY_KEY_SECRET=xxxxx

# Optional: Override the AI model (default: gemini-2.5-flash)
# supabase secrets set GEMINI_MODEL=gemini-2.5-flash
```

---

### ✅ Step 4 — Deploy Edge Functions

```bash
# Install Supabase CLI first if you haven't
npm install -g supabase

# Login to your project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all three edge functions
supabase functions deploy analyze-contract
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

Your `Project Ref` is in Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`

---

### ✅ Step 5 — Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🧪 Test Each Feature

| Feature | How to test |
|---|---|
| **Auth** | Sign up with a real email. Check your inbox for the confirmation email from Supabase. |
| **Upload & AI Analysis** | Upload a PDF/DOCX contract. Go to Dashboard → check the processing page. Should complete in ~30s. |
| **AI Citations** | In the Result page, each clause should cite a specific section (e.g. "Section 6 of DPDP Act 2023") — not generic text. |
| **Payment (Test)** | Go to Upgrade page → Select Pro Monthly → Razorpay modal opens → use test card `4111 1111 1111 1111`. |
| **Share Report** | Open any completed report → Share button → copy the link → open in incognito. |
| **Profile Photo** | Go to Profile → upload a photo. It should appear immediately in the navbar. |

---

## 🏗️ Architecture (What's Actually Built)

```
Frontend (React + Vite)
    │
    ├── Auth: Supabase Auth (JWT, email confirmation, session refresh)
    ├── File Upload: Supabase Storage (contracts bucket)
    ├── Document Parsing: PDF.js + Mammoth (runs client-side in browser)
    │
    └── Supabase Edge Functions (Deno runtime)
            │
            ├── analyze-contract
            │       ├── RAG Retriever (keyword scoring against 8 Indian laws)
            │       ├── Gemini 2.5 Flash (legal analysis with legal context)
            │       └── Writes clauses, issues, suggestions to Supabase DB
            │
            ├── create-razorpay-order
            │       └── Calls Razorpay API to create order securely
            │
            └── verify-razorpay-payment
                    ├── HMAC-SHA256 signature verification
                    └── Updates user plan to 'pro' in profiles table
```

---

## 🇮🇳 RAG Legal Knowledge Base

The AI is grounded with real legal text from 8 Indian regulations. When a contract is uploaded, the system retrieves the most relevant sections and injects them into the Gemini prompt:

| Regulation | Key Areas |
|---|---|
| **DPDP Act 2023** | Consent (S.6), Data Fiduciary obligations (S.8), breach notification |
| **Indian Contract Act 1872** | Valid contracts (S.10), consideration (S.23), non-compete (S.27), indemnity (S.124), damages (S.73) |
| **CGST Act 2017** | Input Tax Credit (S.16), tax invoice requirements (S.31) |
| **IT Act 2000** | Electronic contract validity (S.10A), data protection liability (S.43A) |
| **Arbitration Act 1996** | Arbitration agreement (S.7), appointment of arbitrators (S.11) |
| **Code on Wages 2020** | Payment of wages (S.17), bank transfer requirements |
| **OSH Code 2020** | Working hours (S.25), overtime limits |
| **Factories Act 1948** | Weekly/daily hours (S.51, S.54) |
| **Consumer Protection Act 2019** | Unfair trade practices (S.2(47)), product liability (S.84) |

---

## 🗄️ Database

All data lives in Supabase (PostgreSQL). The schema is in `Supabase schema Complete.sql`.

| Table | Purpose |
|---|---|
| `profiles` | User info, plan (`free`/`pro`), upload counts |
| `reports` | One row per uploaded contract, stores compliance score and overall risk |
| `clauses` | Individual clauses extracted from the contract |
| `clause_issues` | Compliance problems found in each clause |
| `clause_suggestions` | AI-generated fix recommendations |

---

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── context/AuthContext.tsx    # Real Supabase auth (login, signup, session, profile)
│   │   ├── pages/
│   │   │   ├── UploadPage.tsx         # Drag-and-drop file upload + text extraction
│   │   │   ├── ProcessPage.tsx        # Real-time polling of analysis status
│   │   │   ├── ResultPage.tsx         # Full compliance report + PDF export
│   │   │   ├── PaymentPage.tsx        # Real Razorpay checkout integration
│   │   │   ├── SuccessPage.tsx        # Post-payment plan refresh from DB
│   │   │   ├── SharePage.tsx          # Public shared report (DB-backed)
│   │   │   └── ProfilePage.tsx        # Profile photo → Supabase Storage (avatars bucket)
│   │   └── components/
│   ├── lib/
│   │   ├── api.ts                     # Supabase queries (no mocks)
│   │   ├── schema.ts                  # TypeScript types
│   │   └── supabase.ts                # Supabase client init
│   └── documentExtraction.ts          # Client-side PDF.js + Mammoth parsing
│
├── supabase/
│   └── functions/
│       ├── analyze-contract/
│       │   ├── index.ts               # Main edge function
│       │   ├── legal-knowledge-base.ts # 8 Indian laws, ~15 key sections
│       │   └── retriever.ts           # Keyword-based RAG retrieval
│       ├── create-razorpay-order/
│       │   └── index.ts
│       └── verify-razorpay-payment/
│           └── index.ts
│
├── Supabase schema Complete.sql       # Full DB schema — run this in Supabase SQL Editor
├── .env                               # Only frontend public keys (VITE_ prefix)
└── index.html                         # Includes Razorpay checkout.js SDK
```

---

## 🔑 Environment Variables Reference

| Variable | Where to set | Required | Description |
|---|---|---|---|
| `VITE_SUPABASE_URL` | `.env` file | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env` file | ✅ | Supabase public anon key |
| `SERVICE_ROLE_KEY` | Supabase Secrets | ✅ | Supabase service role key (admin writes) |
| `GEMINI_API_KEY` | Supabase Secrets | ✅ | Google AI Studio API key (free at aistudio.google.com) |
| `RAZORPAY_KEY_ID` | Supabase Secrets | ✅ for payments | Razorpay key ID (test or live) |
| `RAZORPAY_KEY_SECRET` | Supabase Secrets | ✅ for payments | Razorpay secret key |
| `GEMINI_MODEL` | Supabase Secrets | ❌ optional | Override AI model (default: `gemini-2.5-flash`) |

---

## 🚢 Deploy to Production

### Frontend → Vercel

```bash
# Push to GitHub, then in Vercel:
# Build Command: npm run build
# Output Dir: dist
# Add env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

The `vercel.json` is already configured for SPA routing.

### Edge Functions → Supabase

Already deployed in Step 4 above. Re-deploy after any changes:

```bash
supabase functions deploy analyze-contract
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
```

---

## ⚠️ Common Issues & Fixes

| Problem | Solution |
|---|---|
| "Missing GEMINI_API_KEY" error | Run `supabase secrets set GEMINI_API_KEY=...` then redeploy the function |
| Contract stuck on "Processing" | Check edge function logs in Supabase Dashboard → Edge Functions → Logs |
| Payment modal doesn't open | Check browser console. Most likely `RAZORPAY_KEY_ID` secret is missing |
| Auth email not received | Check Supabase → Authentication → Email Templates. Ensure Email Auth is enabled |
| "Service Role Key missing" | The edge function needs `SERVICE_ROLE_KEY` secret — not `SUPABASE_SERVICE_ROLE_KEY` |
| Profile photo not saving | Ensure the `avatars` Supabase Storage bucket is created and set to **public** |
| Upload fails | Ensure the `contracts` Supabase Storage bucket exists (can be private) |

---

## 📋 Razorpay Test Cards

Use these in test mode (when key starts with `rzp_test_`):

| Type | Number | CVV | Expiry |
|---|---|---|---|
| Success | `4111 1111 1111 1111` | Any 3 digits | Any future date |
| Failure | `4000 0000 0000 0002` | Any 3 digits | Any future date |

---

## Legal Disclaimer

ContractCheck AI is an AI-assisted tool and does not constitute legal advice. The analysis is generated by artificial intelligence and may contain errors or omissions. Always consult a qualified advocate for legal matters.
