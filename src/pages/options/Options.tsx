import '@pages/options/Options.css';
import React, { useState } from 'react';

interface LLMSettings {
  apiKey: string;
  apiBase: string;
}

export default function Options() {
  const [settings, setSettings] = useState<LLMSettings>({
    apiKey: '',
    apiBase: '',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      // TODO: Implement storage in next task
      await new Promise(resolve => setTimeout(resolve, 500)); // Temporary mock
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="settings-form">
        <h1 className="title">LLM Settings</h1>

        <div className="form-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            value={settings.apiKey}
            onChange={handleChange}
            placeholder="Enter your API key"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apiBase">API Base URL</label>
          <input
            type="url"
            id="apiBase"
            name="apiBase"
            value={settings.apiBase}
            onChange={handleChange}
            placeholder="https://api.openai.com/v1"
            required
          />
        </div>

        <button
          type="submit"
          className="save-button"
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>

        {saveStatus === 'saved' && (
          <div className="status-message success">Settings saved successfully!</div>
        )}
        {saveStatus === 'error' && (
          <div className="status-message error">Failed to save settings. Please try again.</div>
        )}
      </form>
    </div>
  );
}
