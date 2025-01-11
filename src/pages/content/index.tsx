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

// Create notification container
const notificationContainer = document.createElement('div');
notificationContainer.id = '__amw_notification';
notificationContainer.style.cssText = `
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 999999;
  padding: 12px 24px;
  border-radius: 4px;
  font-family: system-ui;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(-20px);
`;
document.body.appendChild(notificationContainer);

// Handle script status notifications
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SCRIPT_STATUS') {
    // Update notification style based on status
    notificationContainer.style.backgroundColor = message.status === 'error' ? '#fee2e2' : '#dcfce7';
    notificationContainer.style.color = message.status === 'error' ? '#991b1b' : '#166534';
    notificationContainer.style.border = `1px solid ${message.status === 'error' ? '#fecaca' : '#bbf7d0'}`;

    // Show message
    notificationContainer.textContent = message.message;
    notificationContainer.style.opacity = '1';
    notificationContainer.style.transform = 'translateY(0)';

    // Hide after 3 seconds
    setTimeout(() => {
      notificationContainer.style.opacity = '0';
      notificationContainer.style.transform = 'translateY(-20px)';
    }, 3000);
  }
});
