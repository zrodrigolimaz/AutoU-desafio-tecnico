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

### INSTRUÇÃO:
Classifique o email abaixo como PRODUTIVO ou IMPRODUTIVO e extraia os metadados solicitados.
Responda APENAS com um objeto JSON válido. Não inclua nenhuma outra palavra, explicação ou bloco de código markdown.

1. CATEGORIA:
   PRODUTIVO: requer ação concreta (agendamento, suporte, suporte técnico, aprovação).
   IMPRODUTIVO: vago, sem ação, felicitação ou agradecimento genérico.

2. ASSUNTO (TOPIC):
   Resumo do tema central em até 4 palavras.

3. URGÊNCIA:
   - ALTA: Erros críticos, sistemas fora, prazos de hoje.
   - MÉDIA: Dúvidas ou tarefas com prazos futuros.
   - BAIXA: Informativos e agradecimentos.

### EMAIL PARA ANALISAR:
---INÍCIO DO EMAIL---
{email}
---FIM DO EMAIL---

### FORMATO DA RESPOSTA (JSON APENAS):
{{
  "category": "Produtivo",
  "confidence": 0.95,
  "topic": "assunto extraído",
  "urgency": "Baixa"
}}"""


def classify(text: str) -> dict:
    """Retorna dicionário com categoria, confiança, assunto e urgência via Gemini."""
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

    try:
        data = json.loads(raw)
        
        # Normalização para bater com os Literals do Pydantic
        category = str(data.get("category", "Improdutivo")).capitalize()
        if category not in ["Produtivo", "Improdutivo"]:
            category = "Improdutivo"
            
        urgency = str(data.get("urgency", "Baixa")).capitalize()
        if urgency == "Media": urgency = "Média"
        if urgency not in ["Alta", "Média", "Baixa"]:
            urgency = "Baixa"

        return {
            "category": category,
            "confidence": round(float(data.get("confidence", 0.5)), 4),
            "topic": data.get("topic", "Desconhecido"),
            "urgency": urgency
        }
    except (json.JSONDecodeError, ValueError, KeyError) as exc:
        raise ValueError(f"O modelo retornou um formato inválido: {raw[:200]}") from exc
