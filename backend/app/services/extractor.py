"""
Extração de texto a partir de arquivos .txt, .pdf ou string direta.
"""
import fitz  # PyMuPDF


def extract_from_bytes(content: bytes, filename: str) -> str:
    """Extrai texto de um arquivo enviado via upload."""
    if filename.lower().endswith(".pdf"):
        return _extract_pdf(content)
    return _extract_txt(content)


def _extract_pdf(content: bytes) -> str:
    doc = fitz.open(stream=content, filetype="pdf")
    pages = [page.get_text("text") for page in doc]
    doc.close()
    text = "\n".join(pages).strip()
    if not text:
        raise ValueError("O PDF não contém texto extraível (pode ser uma imagem).")
    return text


def _extract_txt(content: bytes) -> str:
    for encoding in ("utf-8", "latin-1", "cp1252"):
        try:
            return content.decode(encoding).strip()
        except UnicodeDecodeError:
            continue
    raise ValueError("Não foi possível decodificar o arquivo de texto.")
