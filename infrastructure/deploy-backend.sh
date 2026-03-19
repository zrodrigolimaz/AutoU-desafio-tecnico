#!/usr/bin/env bash
# =============================================================================
# deploy-backend.sh
# Build da imagem Docker, push para ECR e deploy no App Runner.
#
# Pré-requisitos:
#   - AWS CLI configurado (aws configure)
#   - Docker rodando
#   - Variáveis de ambiente abaixo preenchidas
# =============================================================================
set -euo pipefail

# ---------- Configuração — edite aqui ----------
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_NAME="meridian-backend"
APP_RUNNER_SERVICE="meridian-backend"
IMAGE_TAG="latest"
# ------------------------------------------------

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "==> [1/5] Autenticando no ECR..."
aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "==> [2/5] Criando repositório ECR (se não existir)..."
aws ecr describe-repositories --repository-names "$ECR_REPO_NAME" --region "$AWS_REGION" 2>/dev/null \
  || aws ecr create-repository --repository-name "$ECR_REPO_NAME" --region "$AWS_REGION"

echo "==> [3/5] Buildando imagem Docker..."
cd "$(dirname "$0")/../backend"
docker build --platform linux/amd64 -t "${ECR_REPO_NAME}:${IMAGE_TAG}" .

echo "==> [4/5] Tagging e push para ECR..."
docker tag "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
docker push "${ECR_URI}:${IMAGE_TAG}"

echo "==> [5/5] Verificando serviço App Runner..."
SERVICE_ARN=$(
  aws apprunner list-services --region "$AWS_REGION" \
    --query "ServiceSummaryList[?ServiceName=='${APP_RUNNER_SERVICE}'].ServiceArn" \
    --output text
)

if [ -z "$SERVICE_ARN" ]; then
  echo "    Serviço não encontrado. Criando via console AWS ou execute:"
  echo "    aws apprunner create-service --cli-input-json file://infrastructure/apprunner-service.json"
else
  echo "    Iniciando novo deploy no App Runner..."
  aws apprunner start-deployment \
    --service-arn "$SERVICE_ARN" \
    --region "$AWS_REGION"
  echo "    Deploy iniciado. Acompanhe em: https://${AWS_REGION}.console.aws.amazon.com/apprunner"
fi

echo ""
echo "Imagem disponível em: ${ECR_URI}:${IMAGE_TAG}"
