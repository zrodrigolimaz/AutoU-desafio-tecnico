"""
Pré-processamento NLP do texto:
  1. Lowercase
  2. Remoção de caracteres especiais
  3. Tokenização
  4. Remoção de stopwords (pt + en)
  5. Stemming com RSLPStemmer (português)
"""
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import RSLPStemmer

# Download silencioso dos recursos NLTK necessários
for resource in ("punkt", "punkt_tab", "stopwords", "rslp"):
    try:
        nltk.data.find(f"tokenizers/{resource}")
    except LookupError:
        nltk.download(resource, quiet=True)

_stemmer = RSLPStemmer()
_stop_pt = set(stopwords.words("portuguese"))
_stop_en = set(stopwords.words("english"))
_stopwords = _stop_pt | _stop_en


def preprocess(text: str) -> str:
    """Retorna o texto pré-processado (tokens unidos por espaço)."""
    text = text.lower()
    text = re.sub(r"http\S+|www\S+", " ", text)       # URLs
    text = re.sub(r"[^a-záéíóúâêôãõàüçñ\s]", " ", text)  # apenas letras
    text = re.sub(r"\s+", " ", text).strip()

    tokens = word_tokenize(text, language="portuguese")
    tokens = [t for t in tokens if t not in _stopwords and len(t) > 2]
    tokens = [_stemmer.stem(t) for t in tokens]

    return " ".join(tokens)
