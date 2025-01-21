import '@assets/styles/tailwind.css';
import Panel from '@pages/panel/Panel';
import '@pages/panel/index.css';
import { createRoot } from 'react-dom/client';

function init() {
  const rootContainer = document.createElement('div');
  rootContainer.id = '__root';
  document.body.appendChild(rootContainer);
  const root = createRoot(rootContainer);
  root.render(<Panel />);
}

init();
