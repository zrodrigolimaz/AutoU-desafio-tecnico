"""
Classificação de emails via Google Gemini API.
Modelo: gemini-2.0-flash-lite (free tier: 1.5M tokens/dia)

Retorna categoria (Produtivo | Improdutivo) e score de confiança em JSON.
"""
import json
import os
from typing import Literal

from google import genai

_PROMPT = """Você é um classificador de emails corporativos de uma empresa do setor financeiro.

Classifique o email abaixo como PRODUTIVO ou IMPRODUTIVO usando os critérios:

PRODUTIVO: email que exige ação concreta e tem contexto suficiente para ser executada.
Para ser PRODUTIVO, o email precisa ter os três elementos:
  1. Ação clara (o que precisa ser feito)
  2. Contexto suficiente (sobre o quê, qual sistema, qual projeto)
  3. Direcionamento (prazo, horário, próximo passo ou urgência)
Exemplos: agendamento de reunião com horário definido, reporte de erro com detalhes, pedido de aprovação com prazo.

IMPRODUTIVO: email vago, sem ação concreta, ou que não gera avanço real no trabalho.
Classifique como IMPRODUTIVO quando:
  - a solicitação for vaga ou sem contexto ("qualquer dia desses", "quando puder", "sem pressa") E não houver prazo nem contexto técnico
  - não houver ação definida ou próximo passo claro
  - for felicitação, agradecimento genérico, aviso de férias ou confraternização
Exemplos: "me liga qualquer dia desses", "você pode me ajudar com uma dúvida?", "feliz aniversário".

REGRA DE PRIORIDADE: se o email tiver linguagem suave ("quando puder", "quando tiver um tempo") MAS também tiver prazo explícito ("hoje", "amanhã", "até sexta") OU contexto técnico crítico ("erro em produção", "sistema fora", "deploy", "bug"), classifique como PRODUTIVO.

Email:
{email}

Responda APENAS com JSON válido, sem markdown, no formato:
{{"category": "Produtivo" ou "Improdutivo", "confidence": número entre 0.0 e 1.0}}"""


def classify(text: str) -> tuple[Literal["Produtivo", "Improdutivo"], float]:
    """Retorna (categoria, confiança) via Gemini."""
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    prompt = _PROMPT.format(email=text[:2000])

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt,
    )

    raw = response.text.strip()

    # Remove blocos de markdown caso o modelo insista em envolvê-los
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    data = json.loads(raw)
    category: Literal["Produtivo", "Improdutivo"] = data["category"]
    confidence: float = round(float(data["confidence"]), 4)

    return category, confidence
