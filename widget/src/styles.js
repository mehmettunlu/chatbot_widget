export const styles = `
  .rag-container {
    --rag-primary: #2563eb;
    --rag-primary-hover: #1d4ed8;
    --rag-bg: #ffffff;
    --rag-text: #1f2937;
    --rag-bot-bg: #f3f4f6;
    --rag-border: #e5e7eb;
    --rag-muted: #6b7280;

    position: fixed;
    z-index: 999999;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .rag-container[data-position="bottom-left"] {
    right: auto;
    left: 24px;
    align-items: flex-start;
  }

  .rag-container[data-theme="dark"] {
    --rag-bg: #1f2937;
    --rag-text: #f9fafb;
    --rag-bot-bg: #374151;
    --rag-border: #4b5563;
    --rag-muted: #9ca3af;
  }

  .rag-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--rag-primary);
    color: #fff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    transition: background 0.2s;
    flex-shrink: 0;
  }

  .rag-toggle:hover {
    background: var(--rag-primary-hover);
  }

  .rag-panel {
    width: 380px;
    height: 560px;
    background: var(--rag-bg);
    color: var(--rag-text);
    border: 1px solid var(--rag-border);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .rag-panel.rag-hidden {
    display: none;
  }

  .rag-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--rag-border);
    background: var(--rag-bg);
    flex-shrink: 0;
  }

  .rag-title {
    font-weight: 600;
    font-size: 16px;
  }

  .rag-close {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--rag-muted);
    font-size: 20px;
    line-height: 1;
    padding: 0 4px;
  }

  .rag-close:hover {
    color: var(--rag-text);
  }

  .rag-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .rag-msg {
    display: flex;
  }

  .rag-msg-user {
    justify-content: flex-end;
  }

  .rag-msg-bot {
    justify-content: flex-start;
  }

  .rag-bubble {
    max-width: 80%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .rag-msg-user .rag-bubble {
    background: var(--rag-primary);
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .rag-msg-bot .rag-bubble {
    background: var(--rag-bot-bg);
    color: var(--rag-text);
    border-bottom-left-radius: 4px;
  }

  .rag-bubble.rag-streaming::after {
    content: '▋';
    display: inline-block;
    animation: rag-blink 0.7s step-end infinite;
    margin-left: 2px;
  }

  @keyframes rag-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .rag-sources {
    font-size: 12px;
    color: var(--rag-muted);
    padding: 0 4px;
    margin-top: -4px;
  }

  .rag-input-area {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--rag-border);
    background: var(--rag-bg);
    flex-shrink: 0;
  }

  .rag-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid var(--rag-border);
    border-radius: 8px;
    font-size: 14px;
    background: var(--rag-bg);
    color: var(--rag-text);
    outline: none;
  }

  .rag-input:focus {
    border-color: var(--rag-primary);
  }

  .rag-send {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--rag-primary);
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .rag-send:hover {
    background: var(--rag-primary-hover);
  }

  @media (max-width: 480px) {
    .rag-container {
      bottom: 0;
      right: 0;
      left: 0;
      align-items: stretch;
    }

    .rag-container[data-position="bottom-left"] {
      left: 0;
      align-items: stretch;
    }

    .rag-panel {
      width: 100%;
      height: 100dvh;
      border-radius: 0;
      margin-bottom: 0;
    }

    .rag-toggle {
      position: fixed;
      bottom: 16px;
      right: 16px;
    }

    .rag-container[data-position="bottom-left"] .rag-toggle {
      right: auto;
      left: 16px;
    }
  }
`;
