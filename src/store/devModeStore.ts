import { create } from 'zustand';

interface DevModeState {
    isDevModeEnabled: boolean;
    checkDevModeEnabled: () => void;
}

const detectDevModeEnabled = async () => {
    try {
        // Property access which throws if developer mode is not enabled
        chrome.userScripts;
        return true
    } catch {
        return false
    }
};

const useDevModeStore = create<DevModeState>((set, get) => ({
    isDevModeEnabled: false,
    checkDevModeEnabled: async () => set({ isDevModeEnabled: await detectDevModeEnabled() }),
}));

export default useDevModeStore;