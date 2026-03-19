from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from app.models.schemas import ClassifyResponse
from app.services.extractor import extract_from_bytes
from app.services.preprocessor import preprocess
from app.services.classifier import classify
from app.services.responder import generate_reply

router = APIRouter(prefix="/api", tags=["email"])

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/classify", response_model=ClassifyResponse)
async def classify_email(
    file: UploadFile | None = File(default=None),
    text: str | None = Form(default=None),
) -> ClassifyResponse:
    # --- Validação de entrada ---
    if not file and not text:
        raise HTTPException(status_code=422, detail="Envie um arquivo ou texto.")

    # --- Extração de texto ---
    if file:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Arquivo maior que 5 MB.")
        if not file.filename:
            raise HTTPException(status_code=422, detail="Nome de arquivo inválido.")
        try:
            raw_text = extract_from_bytes(content, file.filename)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
    else:
        raw_text = (text or "").strip()
        if len(raw_text) < 10:
            raise HTTPException(status_code=422, detail="Texto muito curto (mín. 10 caracteres).")

    # --- Pipeline NLP ---
    try:
        processed_text = preprocess(raw_text)
        category, confidence = classify(raw_text)
        suggested_reply = generate_reply(raw_text, category)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Erro na API de IA: {exc}",
        ) from exc

    return ClassifyResponse(
        category=category,
        confidence=confidence,
        suggested_reply=suggested_reply,
        processed_text=processed_text,
    )
