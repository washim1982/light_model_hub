import { ChangeEvent, FormEvent, useState } from 'react';
import { ChatMessage } from '../types';
import './chat.css';

const DocumentRagView = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const pushMessage = (role: ChatMessage['role'], content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, content, timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const names = Array.from(files).map((file) => file.name);
    setUploadedFiles((prev) => [...new Set([...prev, ...names])]);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;
    pushMessage('user', input.trim());
    pushMessage('assistant', 'RAG response generated from the uploaded context.');
    setInput('');
  };

  return (
    <section className="card chat-shell">
      <header className="section-title">Document (RAG)</header>
      <div className="grid-two">
        <div>
          <p>Upload PDF, TXT, DOC or DOCX files. They will be chunked and embedded for retrieval augmented chat.</p>
          <label className="upload-field">
            <input type="file" accept=".pdf,.txt,.doc,.docx" multiple onChange={handleUpload} />
            <span>Select files</span>
          </label>
          <ul>
            {uploadedFiles.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chat-board">
        <div className="chat-bubbles">
          {messages.map((message) => (
            <article key={message.id} className={`chat-bubble ${message.role}`}>
              {message.content}
            </article>
          ))}
        </div>
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about your documents" />
          <button type="submit" className="icon">
            ↗
          </button>
        </form>
      </div>
    </section>
  );
};

export default DocumentRagView;