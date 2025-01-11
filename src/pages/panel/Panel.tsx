import '@pages/panel/Panel.css';
import { useEffect, useState } from 'react';

const DEFAULT_SCRIPT = `// ==UserScript==
// @name         Gray Background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes the background color to light gray
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==


(function() {
  'use strict';

  // Change background color to light gray
  document.body.style.backgroundColor = '#f0f0f0';
  console.log('[amw] background color changed to gray');
})();`;

export default function Panel() {
  const [script, setScript] = useState(DEFAULT_SCRIPT);

  useEffect(() => {
    console.debug('[amw] loading saved script from storage');
    // Load saved script from storage
    chrome.storage.sync.get(['userScript'], (result) => {
      if (result.userScript) {
        console.debug('[amw] found saved script, loading into editor');
        setScript(result.userScript);
      } else {
        console.debug('[amw] no saved script found, using default script');
      }
    });
  }, []);

  const handleSave = async () => {
    console.debug('[amw] saving script');
    try {
      // Save to storage
      await chrome.storage.sync.set({ userScript: script });
      console.log('[amw] script saved successfully');
    } catch (error) {
      console.error('[amw] error saving script:', error);
    }
  };

  return (
    <div className="container p-4 h-screen flex flex-col bg-white">
      <h1 className="text-xl font-bold mb-4 text-gray-800">All My Web</h1>
      <textarea
        className="flex-grow p-2 mb-4 w-full font-mono text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="// Enter your script here..."
        spellCheck="false"
      />
      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save
      </button>
    </div>
  );
}
