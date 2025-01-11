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
