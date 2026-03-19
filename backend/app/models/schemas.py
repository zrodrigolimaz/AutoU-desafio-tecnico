from typing import Literal
from pydantic import BaseModel, Field


class ClassifyResponse(BaseModel):
    category: Literal["Produtivo", "Improdutivo"]
    confidence: float = Field(ge=0.0, le=1.0)
    topic: str
    urgency: Literal["Alta", "Média", "Baixa"]
    suggested_reply: str
    processed_text: str


class ErrorResponse(BaseModel):
    detail: str
