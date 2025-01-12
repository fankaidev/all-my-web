import '@pages/panel/Panel.css';
import { Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom';
import ScriptEditor from './ScriptEditor';
import ScriptList from './ScriptList';
import { Script } from './ScriptManager';
import useScripts from './useScripts';

function PanelContent() {
  const navigate = useNavigate();
  const { scripts, isLoading, error, addScript, editScript, deleteScript, togglePause } = useScripts();

  const handleAddScript = async () => {
    const newScript = await addScript();
    navigate(`/edit/${newScript.id}`);
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading scripts...</div>;
  }

  if (error) {
    return <div className="flex-1 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-700">Script Manager</h2>
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
                <ScriptList
                  scripts={scripts}
                  onEdit={(id) => navigate(`/edit/${id}`)}
                  onDelete={deleteScript}
                  onTogglePause={togglePause}
                />
              </>
            }
          />
          <Route
            path="/edit/:id"
            element={<EditRoute scripts={scripts} editScript={editScript} />}
          />
        </Routes>
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
