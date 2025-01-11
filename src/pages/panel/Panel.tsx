import '@pages/panel/Panel.css';
import { Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom';
import ScriptEditor from './ScriptEditor';
import ScriptList from './ScriptList';
import { Script } from './ScriptManager';
import useScripts from './useScripts';

function PanelContent() {
  const navigate = useNavigate();
  const { scripts, isLoading, error, addScript, editScript, deleteScript } = useScripts();

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
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">All My Web</h1>
          </div>
          <p className="mt-2 text-gray-600">Manage your web automation scripts</p>
        </header>

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

function EditRoute({ scripts, editScript }: { scripts: Script[], editScript: (id: number, name: string, body: string) => Promise<void> }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const script = scripts.find(s => s.id === parseInt(id || ''));

  if (!script) {
    return <div>Script not found</div>;
  }

  return (
    <ScriptEditor
      script={script}
      onSave={async (id, name, body) => {
        await editScript(id, name, body);
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
