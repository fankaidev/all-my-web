import './style.css';
const div = document.createElement('div');
div.id = '__root';
document.body.appendChild(div);

try {
  console.log('[amw]: content script loaded');
} catch (e) {
  console.error(e);
}

console.debug('[amw] content script loaded');

// Load and execute the user script
chrome.storage.sync.get(['userScript'], (result) => {
  if (result.userScript) {
    console.debug('[amw] found user script, executing');
    try {
      // Remove metadata block if exists
      const cleanScript = result.userScript.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/m, '');
      // Execute the script
      eval(cleanScript);
    } catch (error) {
      console.error('[amw] error executing user script:', error);
    }
  } else {
    console.debug('[amw] no user script found');
  }
});
