interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const SettingsView = ({ theme, onToggleTheme }: Props) => (
  <section className="card">
    <h2>Settings</h2>
    <div className="grid-two">
      <div>
        <div className="section-title">Theme</div>
        <button onClick={onToggleTheme}>Switch to {theme === 'dark' ? 'Light' : 'Dark'} mode</button>
      </div>
      <div>
        <div className="section-title">Defaults</div>
        <label>
          Default Model
          <select>
            <option>Llama3 8B Instruct</option>
            <option>Mistral 7B</option>
            <option>Phi-3 Mini</option>
          </select>
        </label>
        <label>
          Context limit
          <input type="number" defaultValue={32768} />
        </label>
      </div>
    </div>
  </section>
);

export default SettingsView;