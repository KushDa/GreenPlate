# Dockerfile for FastAPI application optimized for Google Cloud Run

FROM python:3.12-slim AS base

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

COPY . .

USER appuser

EXPOSE 8080

CMD ["uvicorn", "app.app:app", \
     "--host", "0.0.0.0", \
     "--port", "8080", \
     "--workers", "2"]
