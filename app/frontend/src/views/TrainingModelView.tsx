import { useState } from 'react';
import { baseModels, customModels } from '../data.mock';
import { CustomModel } from '../types';

const TrainingModelView = () => {
  const [selectedBase, setSelectedBase] = useState(baseModels[0]);
  const [models, setModels] = useState<CustomModel[]>(customModels);
  const [newModelName, setNewModelName] = useState('');

  const addModel = () => {
    if (!newModelName.trim()) return;
    const model: CustomModel = {
      id: crypto.randomUUID(),
      name: `${newModelName}-${selectedBase.replace(/\s/g, '')}`,
      baseModel: selectedBase,
      status: 'queued'
    };
    setModels((prev) => [...prev, model]);
    setNewModelName('');
  };

  return (
    <section className="card">
      <h2>Training Playground</h2>
      <p>
        Fine-tune open-source models with the QORA method. Manage existing fine-tunes and launch new jobs from
        your datasets.
      </p>
      <div className="grid-two">
        <div>
          <div className="section-title">Base models</div>
          <select value={selectedBase} onChange={(event) => setSelectedBase(event.target.value)}>
            {baseModels.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="section-title">Custom models</div>
          <ul className="custom-models">
            {models.map((model) => (
              <li key={model.id}>
                <div>
                  <strong>{model.name}</strong>
                  <p>{model.baseModel}</p>
                </div>
                <span className={`status ${model.status}`}>{model.status}</span>
              </li>
            ))}
          </ul>
          <div className="custom-models new-model">
            <input
              value={newModelName}
              onChange={(event) => setNewModelName(event.target.value)}
              placeholder="Model nickname"
            />
            <button className="primary" onClick={addModel}>
              Add model via QORA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingModelView;