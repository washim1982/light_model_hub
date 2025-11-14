from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: datetime


class ChatHistoryCreate(BaseModel):
    email: EmailStr
    title: str
    content: str


class ChatHistoryRead(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ProjectRequest(BaseModel):
    description: str


class ProjectResponse(BaseModel):
    files: List[str]
    description: str


class DocumentPayload(BaseModel):
    filename: str
    content: str


class PromptPayload(BaseModel):
    prompt: str


class ModelTrainRequest(BaseModel):
    base_model: str
    dataset: str
    alias: Optional[str] = None


class ModelTrainResponse(BaseModel):
    model_name: str
    status: str = 'queued'


class HuggingFaceDownload(BaseModel):
    repo_id: str
    revision: str = 'main'
    quantization: str = 'bf16'