export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ProjectFile {
  path: string;
  type: 'file' | 'folder';
  content?: string;
}

export interface CustomModel {
  id: string;
  name: string;
  baseModel: string;
  status: 'ready' | 'training' | 'queued';
  dataset?: string;
}