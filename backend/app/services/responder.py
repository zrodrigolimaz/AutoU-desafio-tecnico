"""
Geração de resposta automática via Google Gemini API.
Modelo: gemini-2.0-flash (free tier: 1.5M tokens/dia)
"""
import os
from typing import Literal

from google import genai

_PROMPT_PRODUTIVO = """Você é um assistente corporativo de uma empresa do setor financeiro.
Um email foi recebido e classificado como PRODUTIVO — requer ação ou resposta profissional.

Conteúdo do email:
{email}

Escreva uma resposta profissional, cordial e objetiva em português brasileiro.
Máximo de 3 parágrafos curtos. Vá direto ao ponto, sem saudações genéricas como "Caro(a)".
Responda apenas o texto da resposta, sem assunto nem assinatura."""

_PROMPT_IMPRODUTIVO = """Você é um assistente corporativo de uma empresa do setor financeiro.
Um email foi recebido e classificado como IMPRODUTIVO — não requer ação imediata (ex: felicitações, agradecimentos).

Conteúdo do email:
{email}

Escreva uma resposta curta, simpática e profissional em português brasileiro. Máximo de 2 frases.
Responda apenas o texto da resposta, sem assunto nem assinatura."""


def generate_reply(email_text: str, category: Literal["Produtivo", "Improdutivo"]) -> str:
    """Gera e retorna a resposta sugerida via Gemini."""
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    template = _PROMPT_PRODUTIVO if category == "Produtivo" else _PROMPT_IMPRODUTIVO
    prompt = template.format(email=email_text[:2000])

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt,
    )

    return response.text.strip()
