import { useMemo, useState } from 'react';
import { ProjectFile } from '../types';
import { starterFiles } from '../data.mock';

const CreateProjectView = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>(starterFiles);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(starterFiles[1]);

  const handleGenerate = () => {
    if (!projectDescription.trim()) return;
    const slug = projectDescription.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const file: ProjectFile = {
      path: `src/${slug || 'feature'}.ts`,
      type: 'file',
      content: `// Auto-generated file\nexport const idea = '${projectDescription}';`
    };
    setProjectFiles((prev) => [...prev.filter((item) => item.path !== file.path), file]);
    setSelectedFile(file);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(projectFiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'project-structure.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const explorerTree = useMemo(() => projectFiles.map((file) => (
    <button key={file.path} className={`tree-item ${selectedFile?.path === file.path ? 'active' : ''}`} onClick={() => setSelectedFile(file)}>
      {file.type === 'folder' ? '📁' : '📄'} {file.path}
    </button>
  )), [projectFiles, selectedFile]);

  return (
    <section className="card create-project-grid">
      <h2>Create Project Agent</h2>
      <p>
        Describe your idea and let the agent assemble a project structure. The agent keeps improving files as
        you iterate.
      </p>
      <div className="project-columns">
        <div className="column">
          <h3>File Explorer</h3>
          <div className="tree">{explorerTree}</div>
        </div>
        <div className="column">
          <h3>Code Preview</h3>
          <pre className="code-preview">{selectedFile?.content ?? 'Select a file to preview its content.'}</pre>
        </div>
        <div className="column">
          <h3>Project Brief</h3>
          <textarea
            value={projectDescription}
            onChange={(event) => setProjectDescription(event.target.value)}
            placeholder="Full-stack AI app with chat and analytics"
          />
          <div className="column-actions">
            <button className="primary" onClick={handleGenerate}>
              Generate / Update
            </button>
            <button onClick={handleDownload}>Download Files</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateProjectView;