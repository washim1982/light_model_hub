import { CustomModel, ProjectFile } from './types';

export const baseModels = [
  'Gemma 2B',
  'Llama3 8B',
  'Phi-3 Mini',
  'Mistral 7B'
];

export const downloadedModels = [
  'Llama3 8B Instruct',
  'Mistral 7B OpenOrca',
  'Phi-3 Mini Instruct'
];

export const starterFiles: ProjectFile[] = [
  { path: 'src', type: 'folder' },
  { path: 'src/main.py', type: 'file', content: 'from fastapi import FastAPI' },
  { path: 'src/components', type: 'folder' },
  { path: 'src/components/App.tsx', type: 'file', content: 'export const App = () => null;' }
];

export const customModels: CustomModel[] = [
  {
    id: '1',
    name: 'SupportBot-Gemma',
    baseModel: 'Gemma 2B',
    status: 'ready'
  },
  {
    id: '2',
    name: 'Contracts-Llama3',
    baseModel: 'Llama3 8B',
    status: 'training',
    dataset: 'contracts-v1.jsonl'
  }
];