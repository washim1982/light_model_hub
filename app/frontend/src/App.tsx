import { useMemo, useState } from 'react';
import './App.css';
import { downloadedModels } from './data.mock';
import ModelHubView from './views/ModelHubView';
import DocumentRagView from './views/DocumentRagView';
import CreateProjectView from './views/CreateProjectView';
import TrainingModelView from './views/TrainingModelView';
import HuggingFaceView from './views/HuggingFaceView';
import SettingsView from './views/SettingsView';
import ChatHistoryView from './views/ChatHistoryView';

export type ViewId =
  | 'modelHub'
  | 'document'
  | 'createProject'
  | 'training'
  | 'huggingFace'
  | 'settings'
  | 'chatHistory';

const navItems: { id: ViewId; label: string; icon: string }[] = [
  { id: 'modelHub', label: 'Model Hub', icon: '🤖' },
  { id: 'document', label: 'Document (RAG)', icon: '📄' },
  { id: 'createProject', label: 'Create Project', icon: '🛠️' },
  { id: 'training', label: 'Training Model', icon: '📚' },
  { id: 'huggingFace', label: 'Hugging Face', icon: '⬇️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'chatHistory', label: 'Chat History', icon: '🕓' }
];

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState<ViewId>('modelHub');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const className = useMemo(() => `app ${theme}`, [theme]);

  return (
    <div className={className}>
      <header className="app-header">
        <button
          className="ghost"
          aria-label="Toggle sidebar"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
        >
          ☰
        </button>
        <div className="app-title">Light Model Hub</div>
        <button className="primary" onClick={() => setIsLoggedIn((prev) => !prev)}>
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </header>

      <div className="app-body">
        <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-link ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="icon" aria-hidden>
                {item.icon}
              </span>
              {!isSidebarCollapsed && <span className="label">{item.label}</span>}
            </button>
          ))}
        </aside>

        <main className="main-panel">
          {activeView === 'modelHub' && <ModelHubView downloadedModels={downloadedModels} />}
          {activeView === 'document' && <DocumentRagView />}
          {activeView === 'createProject' && <CreateProjectView />}
          {activeView === 'training' && <TrainingModelView />}
          {activeView === 'huggingFace' && <HuggingFaceView />}
          {activeView === 'settings' && (
            <SettingsView
              theme={theme}
              onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            />
          )}
          {activeView === 'chatHistory' && <ChatHistoryView isLoggedIn={isLoggedIn} />}
        </main>
      </div>
    </div>
  );
}

export default App;