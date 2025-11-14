from __future__ import annotations

from datetime import datetime

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chats = relationship('ChatHistory', back_populates='user')


class ChatHistory(Base):
    __tablename__ = 'chat_history'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String(120))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='chats')


class ProjectSession(Base):
    __tablename__ = 'projects'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    description = Column(Text, nullable=False)
    files = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DocumentUpload(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    filename = Column(String(255))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class CustomModel(Base):
    __tablename__ = 'custom_models'

    id = Column(Integer, primary_key=True)
    name = Column(String(160), unique=True, nullable=False)
    base_model = Column(String(80), nullable=False)
    status = Column(String(40), default='queued')
    dataset = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)