import { FormEvent, useState } from 'react';

const HuggingFaceView = () => {
  const [repoId, setRepoId] = useState('meta-llama/Llama-3-8B-Instruct');
  const [revision, setRevision] = useState('main');
  const [quantization, setQuantization] = useState('bf16');
  const [downloadLog, setDownloadLog] = useState<string[]>([]);

  const handleDownload = (event: FormEvent) => {
    event.preventDefault();
    setDownloadLog((prev) => [
      `Queued download for ${repoId}@${revision} (${quantization}) at ${new Date().toLocaleTimeString()}`,
      ...prev
    ]);
  };

  return (
    <section className="card">
      <h2>Hugging Face Downloads</h2>
      <p>Configure model downloads, caching and runtime loading without leaving the hub.</p>
      <form className="huggingface-form" onSubmit={handleDownload}>
        <label>
          Repository ID
          <input value={repoId} onChange={(event) => setRepoId(event.target.value)} placeholder="org/model" />
        </label>
        <label>
          Revision / tag
          <input value={revision} onChange={(event) => setRevision(event.target.value)} />
        </label>
        <label>
          Quantization
          <select value={quantization} onChange={(event) => setQuantization(event.target.value)}>
            <option value="bf16">bf16</option>
            <option value="int4">int4</option>
            <option value="int8">int8</option>
          </select>
        </label>
        <button className="primary" type="submit">
          Download model
        </button>
      </form>
      <div className="download-log">
        <h4>Recent actions</h4>
        <ul>
          {downloadLog.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HuggingFaceView;