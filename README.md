# Desafio Técnico: Automação e Classificação de E-mails

Este projeto consiste no desenvolvimento de uma solução inteligente para automatizar a triagem e resposta de e-mails de uma grande empresa do setor financeiro.

## 🎯 Objetivo
Automatizar a leitura, classificação e sugestão de respostas para e-mails recebidos, otimizando o tempo da equipe e eliminando tarefas manuais repetitivas.

## 📋 Requisitos do Desafio

### 1. Interface Web
- **Upload/Entrada:** Formulário para upload de arquivos (.txt, .pdf) ou inserção direta de texto.
- **Resultados:** Exibição clara da categoria (**Produtivo** ou **Improdutivo**) e da sugestão de resposta gerada pela IA.

### 2. Backend (Python)
- **Processamento:** Script em Python para leitura e pré-processamento de texto (NLP).
- **IA/Classificação:** Integração com APIs de IA (Hugging Face, OpenAI, etc.) para:
  - Classificar o e-mail em **Produtivo** (requer ação) ou **Improdutivo** (não imediato).
  - Gerar uma resposta automática adequada ao contexto.

### 3. Deploy
- A aplicação deve ser hospedada em uma plataforma de nuvem (Vercel, Render, Heroku, etc.) com link funcional para testes.

## 🚀 Como Executar (Localmente)

1. Clone o repositório.
2. Instale as dependências: `pip install -r requirements.txt`.
3. Configure as chaves de API necessárias (.env).
4. Execute o servidor: `python app.py` (ou comando equivalente).

