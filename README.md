# Meridian — Classificador Inteligente de Emails

Aplicação web que utiliza IA para classificar emails corporativos em **Produtivo** ou **Improdutivo** e sugerir respostas automáticas.

## Tecnologias

| Camada | Stack |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Python 3.12 + FastAPI + NLTK |
| IA / NLP | Google Gemini API (`gemini-2.0-flash-lite`) |
| Deploy | AWS S3 + CloudFront (frontend) · AWS App Runner (backend) |
| CI/CD | GitHub Actions |

## Rodando localmente

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- Chave de API do [Google AI Studio](https://aistudio.google.com)

### Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt

cp .env.example .env
# Editar .env e preencher GOOGLE_API_KEY

uvicorn app.main:app --reload
# API disponível em http://localhost:8000
# Docs interativas em http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

npm install

cp .env.example .env
# VITE_API_URL=http://localhost:8000 (já é o padrão)

npm run dev
# Interface disponível em http://localhost:5173
```

### Testando com os exemplos

```bash
# Email produtivo
curl -X POST http://localhost:8000/api/classify \
  -F "file=@samples/produtivo.txt"

# Email improdutivo
curl -X POST http://localhost:8000/api/classify \
  -F "file=@samples/improdutivo.txt"

# Texto direto
curl -X POST http://localhost:8000/api/classify \
  -F "text=Preciso de ajuda com meu acesso ao sistema financeiro com urgência."
```

## Arquitetura

```
Usuário → CloudFront CDN → S3 (React build)
                 └──────────────→ App Runner (FastAPI)
                                       └──→ Google Gemini API
```

### Pipeline NLP

1. **Extração** — PyMuPDF para `.pdf`, decode UTF-8/latin-1 para `.txt`
2. **Pré-processamento** — NLTK: lowercase → tokenização → remoção de stopwords (PT+EN) → stemming RSLP
3. **Classificação** — Gemini `gemini-2.0-flash-lite` com prompt estruturado (retorna JSON com categoria e confiança)
4. **Resposta** — Gemini `gemini-2.0-flash-lite` com prompt contextualizado pela categoria

## Deploy na AWS

### 1. Configurar secrets no GitHub

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
APP_RUNNER_ROLE_ARN
GOOGLE_API_KEY
CLOUDFRONT_URL
CLOUDFRONT_DISTRIBUTION_ID
```

### 2. Primeiro deploy do backend

```bash
chmod +x infrastructure/deploy-backend.sh
./infrastructure/deploy-backend.sh
```

Edite `infrastructure/apprunner-service.json` com seu Account ID e tokens, depois:

```bash
aws apprunner create-service \
  --cli-input-json file://infrastructure/apprunner-service.json \
  --region us-east-1
```

### 3. Criar distribuição CloudFront

Após criar o bucket via `deploy-frontend.sh`, configure no console AWS:
- Origin: S3 bucket com OAC
- Default root object: `index.html`
- Error pages: 403/404 → `/index.html`

### 4. Deploy do frontend

```bash
# Editar S3_BUCKET e VITE_API_URL no script
chmod +x infrastructure/deploy-frontend.sh
./infrastructure/deploy-frontend.sh
```

### 5. CI/CD automático

A partir do segundo deploy, `git push origin main` aciona o GitHub Actions automaticamente.

## Estrutura do repositório

```
├── backend/              # API Python
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/       # POST /api/classify
│   │   ├── services/     # extractor, preprocessor, classifier, responder
│   │   └── models/       # schemas Pydantic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/             # Interface React
│   └── src/
│       ├── components/   # EmailInput, ResultCard, ProcessingSteps, HistoryList
│       ├── pages/
│       ├── hooks/
│       └── lib/
├── infrastructure/       # Scripts de deploy AWS + config App Runner
├── samples/              # Emails de exemplo (.txt)
└── docs/specs/           # Documento de design da arquitetura
```

## Exemplo de resposta da API

```json
{
  "category": "Produtivo",
  "confidence": 0.9134,
  "suggested_reply": "Olá, recebemos sua solicitação de acesso ao módulo de relatórios...",
  "processed_text": "tent acess modul relatori financ mensag acess neg permiss"
}
```
