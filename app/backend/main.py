from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import ChatHistory, CustomModel, DocumentUpload, ProjectSession, User
from schemas import (
    ChatHistoryCreate,
    ChatHistoryRead,
    DocumentPayload,
    PromptPayload,
    HuggingFaceDownload,
    ModelTrainRequest,
    ModelTrainResponse,
    ProjectRequest,
    ProjectResponse,
    UserCreate,
    UserRead,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
app = FastAPI(title="Light Model Hub API")
Base.metadata.create_all(bind=engine)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


@app.post("/auth/register", response_model=UserRead)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=UserRead)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user


@app.post("/chat/model-hub", response_model=ChatHistoryRead)
def save_chat(payload: ChatHistoryCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    item = ChatHistory(user_id=user.id, title=payload.title, content=payload.content)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@app.get("/chat/history", response_model=List[ChatHistoryRead])
def read_history(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(ChatHistory).filter(ChatHistory.user_id == user.id).order_by(ChatHistory.created_at.desc()).all()


@app.post("/documents/upload")
def upload_document(payload: DocumentPayload, db: Session = Depends(get_db)):
    document = DocumentUpload(filename=payload.filename, content=payload.content)
    db.add(document)
    db.commit()
    return {"status": "stored", "id": document.id}


@app.post("/documents/chat")
def document_chat(payload: PromptPayload):
    return {"response": f"Answer derived from uploaded context for: {payload.prompt}"}


@app.post("/projects/generate", response_model=ProjectResponse)
def generate_project(payload: ProjectRequest, db: Session = Depends(get_db)):
    if not payload.description.strip():
        raise HTTPException(status_code=400, detail="Description required")
    files = ["README.md", "app/backend/main.py", "app/frontend/src/App.tsx"]
    session = ProjectSession(description=payload.description, files="\n".join(files))
    db.add(session)
    db.commit()
    return ProjectResponse(description=payload.description, files=files)


@app.post("/training/run", response_model=ModelTrainResponse)
def train_model(payload: ModelTrainRequest, db: Session = Depends(get_db)):
    name = f"{payload.alias or 'custom'}-{payload.base_model}".replace(' ', '')
    record = CustomModel(name=name, base_model=payload.base_model, dataset=payload.dataset, status='training')
    db.add(record)
    db.commit()
    return ModelTrainResponse(model_name=name, status=record.status)


@app.get("/training/models", response_model=List[ModelTrainResponse])
def list_models(db: Session = Depends(get_db)):
    models = db.query(CustomModel).order_by(CustomModel.created_at.desc()).all()
    return [ModelTrainResponse(model_name=model.name, status=model.status) for model in models]


@app.post("/huggingface/download")
def download_model(payload: HuggingFaceDownload):
    return {
        "message": "Download scheduled",
        "repo_id": payload.repo_id,
        "revision": payload.revision,
        "quantization": payload.quantization,
        "scheduled_at": datetime.utcnow().isoformat(),
    }