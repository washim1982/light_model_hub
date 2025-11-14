FROM node:20-bullseye AS frontend-builder
WORKDIR /app/frontend
COPY app/frontend/package*.json ./
RUN npm install
COPY app/frontend ./
RUN npm run build

FROM python:3.11-slim AS backend
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    FRONTEND_DIST=/opt/app/frontend/dist
WORKDIR /opt/app

COPY app/backend/requirements.txt ./backend/requirements.txt
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r backend/requirements.txt

COPY app/backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /opt/app/backend
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]