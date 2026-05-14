# Multilingual RAG Chatbot Widget

A streaming RAG chatbot that answers questions from your documents in German, English, or Turkish — whichever language the user asks in. Embeds into any website via a single `<script>` tag.

---

## Quickstart

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd chatbot_widget
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   ```

3. **Start the backend**
   ```bash
   docker compose up -d
   ```
   Verify it's running:
   ```bash
   curl http://localhost:8000/health
   # {"status":"ok","version":"0.1.0"}
   ```

4. **Build the widget bundle**
   ```bash
   cd widget && npm install && npm run build
   ```
   This produces `widget/dist/chatbot.min.js`. The `dist/` folder is gitignored — you must run this step after every fresh clone.

5. **Ingest sample documents**
   ```bash
   curl -X POST http://localhost:8000/ingest \
     -F "files=@examples/sample-docs/handbuch.md" \
     -F "files=@examples/sample-docs/handbook.md" \
     -F "files=@examples/sample-docs/elkitabi.md"
   ```

6. **Open the demo**

   Start a local server from the project root:
   ```bash
   python3 -m http.server 3000
   ```
   Then open [http://localhost:3000/examples/basic.html](http://localhost:3000/examples/basic.html) in your browser.

---

## Embedding in Your Own Site

Add a single script tag to your HTML:

```html
<script
  src="https://your-cdn/chatbot.min.js"
  data-api-url="https://your-backend-url"
  data-theme="light"
  data-title="Ask the docs"
  data-language="auto"
  data-position="bottom-right">
</script>
```

### Script tag attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-api-url` | *(required)* | URL of the backend (no trailing slash) |
| `data-theme` | `light` | `light` or `dark` |
| `data-title` | `AI Assistant` | Title shown in the chat panel header |
| `data-language` | `auto` | Reserved for future use |
| `data-position` | `bottom-right` | `bottom-right` or `bottom-left` |

---

## Ingesting Your Own Documents

Send PDF, TXT, or MD files to the `/ingest` endpoint:

```bash
curl -X POST http://localhost:8000/ingest \
  -F "files=@your-document.pdf" \
  -F "files=@another-doc.md"
```

Response:
```json
{"status": "success", "chunks_added": 12, "files_processed": ["your-document.pdf", "another-doc.md"]}
```

---

## Project Structure

```
.
├── backend/          # FastAPI backend with ChromaDB
│   ├── rag/          # Pipeline, vectorstore, ingestion logic
│   ├── api/          # HTTP endpoints (thin wrappers)
│   ├── app.py
│   └── Dockerfile
├── widget/           # Vanilla JS Web Component
│   ├── src/
│   └── dist/         # Build output (gitignored, run npm run build)
├── examples/
│   ├── basic.html
│   └── sample-docs/  # DE/EN/TR sample documents
├── docs/
│   └── BUILD_SPEC.md
├── docker-compose.yml
└── .env.example
```

---

## Security Notes

> **Note:** The `/ingest` endpoint is intentionally unauthenticated for the MVP and local demo use. It must be protected (e.g., by an API key, IP allowlist, or network-level restriction) before any public production deployment. The current setup is suitable for local development and a controlled demo, not for an open internet-facing service.

---

## Roadmap

The following limitations are known and acceptable for this MVP:

- No conversation memory — each question is independent
- No rate limiting on any endpoint
- No `/ingest` authentication (see Security Notes above)
- ChromaDB uses local file persistence — not suitable for horizontal scaling
- No automated tests

---

## License

MIT — see [LICENSE](LICENSE).
