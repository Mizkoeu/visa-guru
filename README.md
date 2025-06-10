# Visa Guru - AI-Powered Visa Consultation

An AI-powered SaaS platform that provides personalized visa application guidance for complex immigration scenarios.

## Project Structure

```
visa-guru/
├── frontend/          # Next.js 14 application
├── backend/           # FastAPI application
├── shared/            # Shared types and utilities
├── docs/              # Documentation
└── CLAUDE.md          # Project specification
```

## Quick Start

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## MVP Features

- Smart questionnaire for complex visa scenarios
- AI-powered real-time research using MCP tools
- Personalized document checklist generation
- AI cover letter generation
- Stripe payment integration
- PDF delivery via email

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend (.env)
```
OPENAI_API_KEY=your_openai_key
STRIPE_SECRET_KEY=your_stripe_secret
PERPLEXITY_API_KEY=your_perplexity_key
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```