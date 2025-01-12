
export default function Popup() {
  const openSidePanel = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.windowId) {
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  };

  return (
    <div className="w-64 p-4 bg-white">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-xl font-bold text-gray-900">All My Web</h1>
        <button
          onClick={openSidePanel}
          className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Open Script Manager
        </button>
        <div className="text-center text-sm text-gray-600">
          <a
            href="PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
