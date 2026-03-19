#!/usr/bin/env bash
# =============================================================================
# deploy-frontend.sh
# Build do React e sync para S3 + invalidação do CloudFront.
#
# Pré-requisitos:
#   - AWS CLI configurado
#   - Node.js instalado
#   - Variáveis abaixo preenchidas
# =============================================================================
set -euo pipefail

# ---------- Configuração — edite aqui ou exporte as vars antes de rodar ----------
AWS_REGION="${AWS_REGION:-us-east-1}"
S3_BUCKET="${S3_BUCKET:-}"                          # ex: meridian-frontend-<account-id>
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"  # ID da distribuição CloudFront
VITE_API_URL="${VITE_API_URL:-}"                    # URL do App Runner
# ---------------------------------------------------------------------------------

# Valida variáveis obrigatórias
: "${S3_BUCKET:?Defina S3_BUCKET antes de rodar}"
: "${VITE_API_URL:?Defina VITE_API_URL antes de rodar}"

echo "==> [1/4] Criando bucket S3 (se não existir)..."
aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null \
  || aws s3api create-bucket \
       --bucket "$S3_BUCKET" \
       --region "$AWS_REGION"

# Bloqueia acesso público direto (CloudFront será a origem)
aws s3api put-public-access-block \
  --bucket "$S3_BUCKET" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "==> [2/4] Instalando dependências e buildando o frontend..."
cd "$(dirname "$0")/../frontend"
npm install
VITE_API_URL="$VITE_API_URL" npm run build

echo "==> [3/4] Sincronizando com S3..."
aws s3 sync dist/ "s3://${S3_BUCKET}" \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"

# index.html nunca deve ser cacheado pelo browser
aws s3 cp dist/index.html "s3://${S3_BUCKET}/index.html" \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html"

echo "==> [4/4] Invalidando cache do CloudFront..."
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*"
  echo "    Cache invalidado."
else
  echo "    CLOUDFRONT_DISTRIBUTION_ID não definido — pule esta etapa por ora."
fi

echo ""
echo "Deploy concluído! Bucket: s3://${S3_BUCKET}"
