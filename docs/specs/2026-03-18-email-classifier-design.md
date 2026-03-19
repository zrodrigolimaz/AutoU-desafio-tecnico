# Design Spec: Email Classifier — AutoU Desafio Técnico
**Data:** 2026-03-18
**Status:** Aprovado
**Stack:** Python/FastAPI + React/Tailwind/shadcn + AWS (S3/CloudFront + App Runner)

---

## Contexto

Sistema de automação de classificação de emails para empresa do setor financeiro. Classifica emails em **Produtivo** ou **Improdutivo** e sugere respostas automáticas usando NLP via Hugging Face Inference API.

---

## Arquitetura: Frontend/Backend Desacoplados

```
Usuário
  └─► AWS CloudFront (CDN)
        └─► S3 Bucket (React build estático)
              └─► AWS App Runner (FastAPI + Docker)
                    └─► Hugging Face Inference API
                          ├── facebook/bart-large-mnli  (classificação zero-shot)
                          └── mistralai/Mistral-7B-Instruct  (geração de resposta)
```

---

## Backend (FastAPI)

### Estrutura
```
backend/
├── app/
│   ├── main.py              # FastAPI app + CORS
│   ├── routes/
│   │   └── email.py         # POST /api/classify
│   ├── services/
│   │   ├── extractor.py     # Leitura .txt / .pdf (PyMuPDF)
│   │   ├── preprocessor.py  # NLP pré-processamento (NLTK)
│   │   ├── classifier.py    # Classificação HF zero-shot
│   │   └── responder.py     # Geração de resposta HF
│   └── models/
│       └── schemas.py       # Pydantic models
├── Dockerfile
└── requirements.txt
```

### Endpoint
```
POST /api/classify
  Content-Type: multipart/form-data
  Input:  { file?: File (.txt|.pdf), text?: string }
  Output: {
    category: "Produtivo" | "Improdutivo",
    confidence: float,          # 0.0 - 1.0
    suggested_reply: string,
    processed_text: string      # texto após pré-processamento
  }
```

### Pipeline NLP
1. **Extração:** PyMuPDF para PDF, decode UTF-8 para TXT, texto direto da textarea
2. **Pré-processamento (NLTK):** lowercase → tokenização → remoção de stopwords (pt/en) → stemming
3. **Classificação:** `facebook/bart-large-mnli` via HF Inference API (zero-shot, labels: Produtivo/Improdutivo)
4. **Geração de resposta:** `mistralai/Mistral-7B-Instruct` com prompt contextualizado pela categoria

---

## Frontend (React + Tailwind + shadcn/ui)

### Estrutura
```
frontend/
├── src/
│   ├── components/
│   │   ├── EmailInput.tsx    # Upload drag-and-drop + textarea
│   │   ├── ResultCard.tsx    # Exibe classificação + resposta
│   │   ├── ConfidenceBar.tsx # Indicador visual de confiança (%)
│   │   └── HistoryList.tsx   # Histórico de emails da sessão
│   ├── pages/
│   │   └── Home.tsx
│   ├── hooks/
│   │   └── useClassify.ts   # Lógica de chamada à API
│   └── lib/
│       └── api.ts           # Axios client configurado
```

### Telas e UX
1. **Hero section** — título, descrição do propósito, CTA
2. **Input area** — drag-and-drop de .txt/.pdf + textarea para texto direto, tabs para alternar
3. **Processing state** — stepper animado: "Extraindo texto → Analisando → Classificando → Gerando resposta"
4. **Result card** — badge colorido (verde=Produtivo, amarelo=Improdutivo), barra de confiança, resposta sugerida + botão copiar
5. **Histórico de sessão** — lista lateral com emails processados, clicável para rever resultado

---

## Deploy (AWS)

| Serviço | Uso | Tier |
|---|---|---|
| S3 | Hospedar build estático do React | Free Tier |
| CloudFront | CDN global para o frontend | Free Tier (1TB/mês) |
| App Runner | Rodar container Docker do FastAPI | Free Tier (primeiros meses) |
| ECR | Registry da imagem Docker | Free Tier (500MB) |

### Variáveis de Ambiente (App Runner)
```
HF_API_KEY=hf_...
CORS_ORIGINS=https://d123abc.cloudfront.net
```

---

## Fluxo de Dados Completo

```
1. Usuário faz upload (.txt/.pdf) ou cola texto
2. Frontend → POST /api/classify (FormData)
3. Backend: extrai texto → pré-processa com NLTK
4. HF API: bart-large-mnli → { Produtivo: 0.87, Improdutivo: 0.13 }
5. HF API: Mistral-7B-Instruct → resposta automática contextualizada
6. Backend → retorna JSON { category, confidence, suggested_reply, processed_text }
7. Frontend: exibe ResultCard com animação + adiciona ao histórico
```

---

## Critérios de Avaliação Cobertos

- [x] Classificação correta (Produtivo/Improdutivo)
- [x] Resposta sugerida relevante
- [x] Upload .txt e .pdf + texto direto
- [x] Interface premium e intuitiva
- [x] Backend Python com NLP real (NLTK + HF)
- [x] Hospedagem na nuvem (AWS)
- [x] Código limpo e modular
- [x] README com instruções claras
