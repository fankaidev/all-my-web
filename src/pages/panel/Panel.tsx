import '@pages/panel/Panel.css';
import { useEffect } from 'react';
import ScriptManager from './ScriptManager';

export default function Panel() {
  useEffect(() => {
    console.debug('[amw] Panel component mounted');
  }, []);

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

        <ScriptManager />
      </div>
    </div>
  );
}
