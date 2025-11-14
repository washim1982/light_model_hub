import { FormEvent, useMemo, useState } from 'react';
import { ChatMessage } from '../types';
import './chat.css';

interface Props {
  downloadedModels: string[];
}

const starterTips = [
  'Summarize the latest AI trends',
  'Explain QORA fine-tuning',
  'Generate a TypeScript API client'
];

const formatTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const ModelHubView = ({ downloadedModels }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(downloadedModels[0] ?? 'Gemma 2B');

  const placeholder = useMemo(() => starterTips[Math.floor(Math.random() * starterTips.length)], []);

  const pushMessage = (role: ChatMessage['role'], content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: formatTimestamp()
      }
    ]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    pushMessage('user', userMessage);
    setInput('');
    const assistantReply = `**${selectedModel}** is crafting a response based on your prompt:\n\n> ${userMessage}`;
    pushMessage('assistant', assistantReply);
  };

  const renderInputRow = (position: 'center' | 'bottom') => (
    <form className={`chat-input-row ${position === 'center' ? 'centered-input' : ''}`} onSubmit={handleSubmit}>
      <button type="button" className="icon" title="Upload file">
        +
      </button>
      <button type="button" className="icon" title="Speak">
        🎤
      </button>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={placeholder}
        aria-label="Prompt"
      />
      <select value={selectedModel} onChange={(event) => setSelectedModel(event.target.value)}>
        {downloadedModels.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
      <button type="submit" className="icon" title="Send message">
        ↓
      </button>
    </form>
  );

  return (
    <section className="card chat-shell">
      <div>
        <h2>Model Hub</h2>
        <p className="muted">
          Gemini/ChatGPT inspired interface with full-session context retention. Select downloaded open-source
          models from the dropdown and start chatting.
        </p>
      </div>

      {messages.length === 0 ? (
        renderInputRow('center')
      ) : (
        <div className="chat-board">
          <div className="chat-bubbles">
            {messages.map((message) => (
              <article key={message.id} className={`chat-bubble ${message.role}`}>
                <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
                <footer className="timestamp">{message.timestamp}</footer>
              </article>
            ))}
          </div>
          {renderInputRow('bottom')}
        </div>
      )}
    </section>
  );
};

export default ModelHubView;