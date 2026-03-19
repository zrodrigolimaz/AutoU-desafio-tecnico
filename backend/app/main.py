import os
from contextlib import asynccontextmanager

import nltk
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routes.email import router


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Garante recursos NLTK disponíveis no startup
    for resource in ("punkt", "punkt_tab", "stopwords", "rslp"):
        try:
            nltk.data.find(f"tokenizers/{resource}")
        except LookupError:
            nltk.download(resource, quiet=True)
    yield


app = FastAPI(
    title="Meridian — Email Classifier API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — aceita origens configuradas via env (separadas por vírgula)
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
