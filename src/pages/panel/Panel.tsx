import '@pages/panel/Panel.css';
import { useEffect, useState } from 'react';

const DEFAULT_SCRIPT = `// Example script: Set page background to gray
document.body.style.backgroundColor = '#f0f0f0';
console.log('[amw] background color changed to gray');`;

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
    console.debug('[amw] saving and executing script');
    try {
      // Save to storage
      await chrome.storage.sync.set({ userScript: script });
      console.debug('[amw] script saved to storage successfully');

      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        console.error('[amw] no active tab found');
        return;
      }

      console.debug('[amw] executing script in tab:', tab.id);
      // Execute the script in the active tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (scriptContent) => {
          try {
            // Create a new script element
            const scriptEl = document.createElement('script');
            scriptEl.textContent = scriptContent;
            document.head.appendChild(scriptEl);
            console.log('[amw] script executed successfully');
          } catch (error) {
            console.error('[amw] error executing script in page context:', error);
          }
        },
        args: [script]
      });
      console.log('[amw] script saved and activated successfully');
    } catch (error) {
      console.error('[amw] error saving/executing script:', error);
    }
  };

  return (
    <div className="container p-4 h-screen flex flex-col">
      <h1 className="text-xl font-bold mb-4">All My Web</h1>
      <textarea
        className="flex-grow p-2 mb-4 w-full font-mono text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="// Enter your script here..."
      />
      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save & Run
      </button>
    </div>
  );
}
