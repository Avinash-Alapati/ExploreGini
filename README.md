# 🚀 ExploreGini — Intelligent Startup Discovery & Semantic Search

**ExploreGini** is an AI-powered startup intelligence and discovery engine. It allows investors, founders, and researchers to explore Y Combinator (YC) startups and emerging tech companies through **semantic vector search**, **natural language queries**, and **direct website URL analysis**.

---

## 💡 The Core Idea

Traditional startup databases rely on rigid keyword matching (e.g., searching for "crypto" misses companies describing themselves as "decentralized ledger protocols"). 

**ExploreGini solves this by understanding startup concepts:**
- **Semantic Understanding**: Finds companies based on what they actually do, not just keywords.
- **URL-to-Company Matching**: Paste any startup's landing page URL — ExploreGini crawls the live website, distills the product's value proposition, and instantly surfaces the most relevant comparable companies in the database.
- **Intelligent Fallback**: If a query is outside the database or has low confidence, the engine triggers external web discovery (SearXNG) to find similar startups across the web.

---

## 🛠️ Architecture & How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                       React + Vite UI                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Backend Server                   │
├─────────────────────────────────────────────────────────────┤
│  1. Input Classifier:                                       │
│     • URL -> Async Crawler -> Summary Extraction            │
│     • Text -> Normalized Query String                       │
│                                                             │
│  2. Vector Embedding Engine (fastembed / ONNX):             │
│     • Generates 384-dim normalized vector embeddings        │
│     • Ultra-low memory (<100MB RAM) for cloud deployments   │
│                                                             │
│  3. PostgreSQL + pgvector:                                  │
│     • Cosine distance search with IVFFlat indexing          │
│     • Fast metadata filtering (Batch, Industry, Status)     │
│                                                             │
│  4. Dynamic Fallback Mechanism:                             │
│     • If Similarity < Threshold -> External SearXNG Engine  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- 🔍 **Natural Language Semantic Search**: Search using plain English prompts like *"AI agents automating customer support"* or *"fintech infrastructure for LatAm"*.
- 🌐 **URL Parsing & Live Crawler**: Enter any product website link; the backend parses HTML, metadata, headers, and team pages to extract a concise pitch.
- ⚡ **Lightweight ONNX Embeddings**: Powered by `fastembed` (`all-MiniLM-L6-v2`), avoiding heavy PyTorch dependencies while preserving high accuracy and speed.
- 🗄️ **PostgreSQL with `pgvector`**: High-performance vector similarity search paired with relational filtering (Batch, Industry, Status, Hiring).
- 📊 **Ecosystem Analytics & Stats**: Aggregate metrics by industry breakdown, batch trends, and company status.
- 🎨 **Modern Responsive Frontend**: Interactive filter chips, company cards, similarity scores, and search mode switcher.

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Lucide Icons, Axios, Modern CSS |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy (AsyncIO), Pydantic v2 |
| **Vector Engine** | `fastembed` (ONNX Runtime, `all-MiniLM-L6-v2`), `pgvector` |
| **Database** | PostgreSQL (Neon / Supabase / Local) |
| **Web Crawling & Search** | BeautifulSoup4, HTTPX, SearXNG |
| **Deployment** | Render Blueprint (`render.yaml`), Docker-ready |

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10+ (Recommended: 3.11)
- **Node.js**: 18+ and `npm`
- **PostgreSQL**: Instance with `pgvector` extension enabled (e.g., [Neon](https://neon.tech))

---

### 1. Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\activate

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=postgresql+asyncpg://<username>:<password>@<host>/<database>?ssl=require
   EMBEDDING_MODEL=all-MiniLM-L6-v2
   EMBEDDING_DIM=384
   CORS_ORIGINS=*
   PORT=8000
   HOST=0.0.0.0
   ```

5. **Initialize Database & Seed Data:**
   ```bash
   # Enable pgvector extension and create indexes
   python app/main.py --setup-db

   # (Optional) Generate embeddings for companies
   python app/main.py --embed
   ```

6. **Start the API Server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   API Docs available at: `http://localhost:8000/docs`

---

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install packages:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in `frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/search` | Semantic search with query text or URL + optional batch/industry filters |
| `POST` | `/api/chat` | Conversational / chatbot endpoint for startup similarity matching |
| `GET` | `/api/companies` | Paginated listing of companies with sorting and search filters |
| `GET` | `/api/companies/{slug}` | Detailed profile for a specific company |
| `GET` | `/api/filters` | Dynamic lists of available Batches, Industries, and Regions |
| `GET` | `/api/stats` | High-level metrics and startup distribution statistics |
| `GET` | `/health` | Health check endpoint |

---

## ☁️ Deployment

### One-Click Render Deployment
This repository includes a `render.yaml` configuration for one-click deployment of both the API and Static Frontend on **Render**:

1. Push your code to GitHub.
2. In Render, create a new **Blueprint** and connect your repository.
3. Supply your `DATABASE_URL` environment variable.
4. Render will deploy:
   - **`exploregini-api`**: FastAPI web service
   - **`exploregini-frontend`**: Static web application with rewrite rules

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
