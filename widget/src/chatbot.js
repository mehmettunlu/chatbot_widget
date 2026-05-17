import { styles } from './styles.js';

(function initRAGChatbot() {
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const config = {
    apiUrl: currentScript.getAttribute('data-api-url') || '',
    theme: currentScript.getAttribute('data-theme') || 'light',
    title: currentScript.getAttribute('data-title') || 'AI Assistant',
    language: currentScript.getAttribute('data-language') || 'auto',
    position: currentScript.getAttribute('data-position') || 'bottom-right',
  };

  if (!config.apiUrl) {
    console.error('[RAGChatbot] data-api-url attribute is required');
    return;
  }

  const SOURCES_MARKER = '\n__SOURCES__';

  class RAGChatbot extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isOpen = false;
    }

    connectedCallback() {
      this.render();
      this.attachEvents();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        <div class="rag-container" data-theme="${config.theme}" data-position="${config.position}">
          <button class="rag-chat-btn" aria-label="Open chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <div class="rag-panel rag-hidden">
            <div class="rag-header">
              <span class="rag-title">${config.title}</span>
              <button class="rag-close" aria-label="Close chat">&#x2715;</button>
            </div>
            <div class="rag-messages"></div>
            <div class="rag-input-area">
              <input type="text" class="rag-input" placeholder="..." />
              <button class="rag-send" aria-label="Send">&#x27A4;</button>
            </div>
          </div>
        </div>
      `;
    }

    attachEvents() {
      const chatBtn = this.shadowRoot.querySelector('.rag-chat-btn');
      const close = this.shadowRoot.querySelector('.rag-close');
      const send = this.shadowRoot.querySelector('.rag-send');
      const input = this.shadowRoot.querySelector('.rag-input');
      const panel = this.shadowRoot.querySelector('.rag-panel');

      chatBtn.addEventListener('click', () => {
        this.isOpen = !this.isOpen;
        chatBtn.classList.toggle('rag-hidden', true);  // hide chatBtn
        panel.classList.toggle('rag-hidden', !this.isOpen);
        if (this.isOpen) input.focus();
      });

      close.addEventListener('click', () => {
        this.isOpen = false;
        panel.classList.add('rag-hidden');
        chatBtn.classList.toggle('rag-hidden', false);  // show chatBtn
      });

      const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        this.sendMessage(text);
      };

      send.addEventListener('click', handleSend);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }

    appendMessage(role, text) {
      const messagesEl = this.shadowRoot.querySelector('.rag-messages');
      const msgEl = document.createElement('div');
      msgEl.className = `rag-msg rag-msg-${role}`;
      const bubble = document.createElement('div');
      bubble.className = 'rag-bubble';
      bubble.textContent = text;
      msgEl.appendChild(bubble);
      messagesEl.appendChild(msgEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return bubble;
    }

    appendSources(sources) {
      if (!sources || sources.length === 0) return;
      const messagesEl = this.shadowRoot.querySelector('.rag-messages');
      const sourcesEl = document.createElement('div');
      sourcesEl.className = 'rag-sources';
      sourcesEl.textContent = 'Sources: ' + sources.join(', ');
      messagesEl.appendChild(sourcesEl);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    parseStreamBuffer(buffer) {
      const idx = buffer.lastIndexOf(SOURCES_MARKER);
      if (idx < 0) {
        return { answer: buffer, sources: [] };
      }
      const answer = buffer.substring(0, idx);
      const sourcesJson = buffer.substring(idx + SOURCES_MARKER.length).trim();
      let sources = [];
      try {
        const parsed = JSON.parse(sourcesJson);
        sources = Array.isArray(parsed.sources) ? parsed.sources : [];
      } catch (e) {
        console.warn('[RAGChatbot] failed to parse sources:', e);
      }
      return { answer, sources };
    }

    stripMarkerForDisplay(buffer) {
      const idx = buffer.lastIndexOf(SOURCES_MARKER);
      return idx < 0 ? buffer : buffer.substring(0, idx);
    }

    async sendMessage(question) {
      this.appendMessage('user', question);
      const botBubble = this.appendMessage('bot', '');
      botBubble.classList.add('rag-streaming');
      const messagesEl = this.shadowRoot.querySelector('.rag-messages');

      try {
        const response = await fetch(`${config.apiUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, language: config.language }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          botBubble.textContent = this.stripMarkerForDisplay(buffer);
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }
        buffer += decoder.decode();

        const { answer, sources } = this.parseStreamBuffer(buffer);
        botBubble.textContent = answer;
        botBubble.classList.remove('rag-streaming');
        this.appendSources(sources);
      } catch (err) {
        botBubble.textContent = '⚠ Error: ' + err.message;
        botBubble.classList.remove('rag-streaming');
      }
    }
  }

  customElements.define('rag-chatbot', RAGChatbot);

  function mount() {
    if (document.querySelector('rag-chatbot')) return;
    const el = document.createElement('rag-chatbot');
    document.body.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
