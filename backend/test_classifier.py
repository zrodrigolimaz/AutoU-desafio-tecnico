"""Testa o classificador contra os 20 casos rotulados."""
import sys
import requests

CASES = [
    ("Quando puder hoje, consegue revisar o bug no checkout?", "Produtivo"),
    ("Quando tiver um tempo, precisamos falar sobre o deploy.", "Improdutivo"),
    ("Se der ainda hoje, consegue ajustar o padding do header?", "Produtivo"),
    ("Consegue ver isso quando tiver um tempo?", "Improdutivo"),
    ("Quando puder antes da daily, valida o endpoint de login?", "Produtivo"),
    ("Acho que seria bom falarmos sobre o que aconteceu ontem.", "Improdutivo"),
    ("Se possível ainda hoje, roda os testes no ambiente de staging?", "Produtivo"),
    ("Isso não é urgente, depois a gente vê com calma.", "Improdutivo"),
    ("Quando tiver um tempinho hoje, revisa o PR #210?", "Produtivo"),
    ("Tive uma ideia sobre o sistema, depois te explico.", "Improdutivo"),
    ("Consegue verificar o erro em produção ainda hoje?", "Produtivo"),
    ("Precisamos falar sobre esse ponto qualquer hora.", "Improdutivo"),
    ("Antes do deploy de hoje às 18h, consegue validar os logs?", "Produtivo"),
    ("Quando puder, dá uma olhada nisso aí.", "Improdutivo"),
    ("Se conseguir hoje até o fim do dia, revisa o documento de arquitetura?", "Produtivo"),
    ("Depois a gente alinha isso melhor.", "Improdutivo"),
    ("Quando puder hoje, verifica o bug crítico no login?", "Produtivo"),
    ("Vamos marcar uma reunião pra falar disso qualquer dia.", "Improdutivo"),
    ("Antes de subir pra produção amanhã, valida o ambiente de staging?", "Produtivo"),
    ("Depois você vê isso pra mim.", "Improdutivo"),
]

URL = "http://localhost:8000/api/classify"

correct = 0
errors = []

for i, (text, expected) in enumerate(CASES, 1):
    resp = requests.post(URL, data={"text": text})
    data = resp.json()
    got = data.get("category", "ERRO")
    confidence = data.get("confidence", 0)
    topic = data.get("topic", "-")
    urgency = data.get("urgency", "-")
    ok = got == expected
    if ok:
        correct += 1
    else:
        errors.append((i, expected, got, confidence, text))
    status = "✅" if ok else "❌"
    print(f"{status} Caso {i:02d} | {got:<11} | {urgency:<6} | {topic[:20]:<20} | {text[:45]}")

print(f"\nResultado: {correct}/{len(CASES)} corretos ({correct/len(CASES)*100:.0f}%)")

if errors:
    print("\nErros:")
    for i, expected, got, conf, text in errors:
        print(f"  Caso {i:02d}: esperado={expected}, got={got} ({conf:.2f}) → {text[:60]}")
else:
    print("\nNenhum erro! 🎉")
