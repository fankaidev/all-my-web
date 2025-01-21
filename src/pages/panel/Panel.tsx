import OptionsView from '@/components/options/OptionsView';
import '@pages/panel/Panel.css';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom';
import Warning from '../../components/Warning';
import useDevModeStore from '../../store/devModeStore';
import useScriptStore from '../../store/scriptStore';
import { Script } from '../../types/script';
import ScriptEditor from './ScriptEditor';
import ScriptList from './ScriptList';

function PanelContent() {
  const navigate = useNavigate();
  const { scripts, isLoading, error, loadScripts, addScript, editScript, deleteScript, togglePause } = useScriptStore();
  const { isDevModeEnabled, checkDevModeEnabled } = useDevModeStore();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    loadScripts();
  }, [loadScripts]);

  useEffect(() => {
    checkDevModeEnabled();
  }, [checkDevModeEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowOptions(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddScript = async () => {
    const script = await addScript();
    navigate(`/edit/${script.id}`);
  };

  return (
    <div className="min-h-screen h-screen bg-gray-100">
      <div className="container mx-auto p-2 h-full flex flex-col">
        {showOptions ? (
          <OptionsView onClose={() => setShowOptions(false)} />
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span>Loading scripts...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">All My Web</h1>
              <button
                onClick={() => setShowOptions(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open settings"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            {!isDevModeEnabled && (
              <div className="mb-4">
                <Warning type="error" title="Developer Mode Required">
                  Please enable Developer Mode in chrome://extensions to use user scripts.
                  <ol className="list-decimal list-inside mt-2 ml-2">
                    <li>Open chrome://extensions in a new tab</li>
                    <li>Enable "Developer mode" in the top right corner</li>
                    <li>Reload this extension</li>
                  </ol>
                </Warning>
              </div>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <ScriptList
                      scripts={scripts}
                      onEdit={(id) => navigate(`/edit/${id}`)}
                      onDelete={deleteScript}
                      onTogglePause={togglePause}
                    />
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-600">
                        {scripts.length} script{scripts.length !== 1 ? 's' : ''} total
                      </div>
                      <button
                        onClick={handleAddScript}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Script
                      </button>
                    </div>
                  </>
                }
              />
              <Route
                path="/edit/:id"
                element={<EditRoute scripts={scripts} editScript={editScript} />}
              />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
}

function EditRoute({ scripts, editScript }: { scripts: Script[], editScript: (id: number, name: string, requirement: string, body: string) => Promise<void> }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const script = scripts.find(s => s.id === parseInt(id || ''));

  if (!script) {
    return <div>Script not found</div>;
  }

  return (
    <ScriptEditor
      script={script}
      onSave={async (id, name, requirement, body) => {
        await editScript(id, name, requirement, body);
        navigate('/');
      }}
      onCancel={() => navigate('/')}
    />
  );
}

export default function Panel() {
  return (
    <Router basename="/src/pages/panel/index.html">
      <PanelContent />
    </Router>
  );
}
