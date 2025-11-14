# Light Model Hub

Modern AI workbench that bundles a TypeScript React front-end with a FastAPI backend. The UI ships with a Gemini/ChatGPT style chat interface, retrieval augmented document chat, project generation agent, training playground, Hugging Face download controls, settings, and chat history storage.

```
repo-root
├── app
│   ├── backend  # FastAPI service
│   └── frontend # React client (Vite)
├── README.md
└── .gitignore
```

Both the UI and API now live directly inside the repository (under `app/`) so cloning the repo brings along every project file—no external folders required.

## Frontend
- Framework: React + TypeScript (Vite setup).
- Features: responsive header/sidebar layout, themed chat interface with model dropdown, document upload, project generator with file explorer, QORA training manager, Hugging Face download console, and persisted chat history tiles.
- Prerequisites: Node.js 18+ and npm.
- Install React dependencies (this pulls React, ReactDOM, Vite, and every other package declared in `package.json`):
  ```bash
  cd app/frontend
  npm install
  ```
- To run locally:
  ```bash
  cd app/frontend
  npm run dev
  ```
 The dev server prints a localhost URL—open it in a browser to view the UI.

## Backend
- Stack: FastAPI + SQLite (SQLAlchemy ORM) + passlib hashing.
- Endpoints for auth, chat history storage, RAG uploads, project generation, QORA training queueing, and Hugging Face download scheduling.
- To run locally:
  ```bash
  cd app/backend
  python -m venv .venv && source .venv/bin/activate
  pip install -r requirements.txt
  uvicorn main:app --reload
  ```
 The API defaults to `http://127.0.0.1:8000` and automatically serves the OpenAPI docs at `/docs`.

## Full Project Setup
1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd light_model_hub
   ```
2. **Install frontend (React) dependencies** using the snippet above. This step installs React itself, so no extra manual wiring is needed.
3. **Install backend dependencies** by creating the virtual environment and running `pip install -r requirements.txt`.
4. **Run the backend** with `uvicorn main:app --reload`.
5. **Run the frontend dev server** with `npm run dev`.
6. Visit the printed Vite URL (typically `http://localhost:5173`) and interact with the app. The frontend is already wired to call the FastAPI endpoints defined in `app/backend`.

> If you ever need to bootstrap a fresh React client instead of the provided one, you can run `npm create vite@latest my-app -- --template react-ts`, `cd my-app`, and then copy over the configuration/components showcased here. Afterwards, `npm install` will again fetch React and the rest of the dependencies.

## Docker Workflows

### Development container (`Dockerfile.dev`)
Build a single image that runs both the FastAPI server and the Vite dev server with hot reloading:

```bash
docker build -f Dockerfile.dev -t light-model-hub-dev .
docker run --rm -it -p 8000:8000 -p 5173:5173 light-model-hub-dev
```

The container installs Python, Node.js, and every dependency declared in `requirements.txt` / `package.json`. The FastAPI server listens on port `8000` while Vite serves the UI on `5173`.

### Production container (`Dockerfile`)
The production Dockerfile performs a multi-stage build: it compiles the React app first, then copies the optimized `dist/` bundle into a slim Python image that runs `uvicorn`. FastAPI automatically serves the compiled UI from `/` and exposes API routes alongside it.

```bash
docker build -t light-model-hub .
docker run --rm -p 8000:8000 light-model-hub
```

Visit `http://localhost:8000/` for the bundled UI or `http://localhost:8000/docs` for the OpenAPI docs. The image honors the `FRONTEND_DIST` environment variable if you need to point to a different build output.