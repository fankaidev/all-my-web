import { type AuthState } from '@/types/auth';
import { getAuthToken, getUserInfo, revokeAuthToken, validateToken } from '@/utils/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    validateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            token: null,
            identity: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async () => {
                console.log('[authStore] Starting login...');
                set({ isLoading: true, error: null });
                try {
                    const token = await getAuthToken();
                    console.log('[authStore] Got auth token, fetching user info...');
                    const identity = await getUserInfo(token);
                    console.log('[authStore] Login successful');
                    set({
                        token,
                        identity,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('[authStore] Login failed:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to login',
                        isLoading: false,
                    });
                }
            },

            logout: async () => {
                console.log('[authStore] Starting logout...');
                set({ isLoading: true, error: null });
                try {
                    const { token } = get();
                    if (token) {
                        console.log('[authStore] Revoking token...');
                        await revokeAuthToken(token);
                    }
                    console.log('[authStore] Logout successful');
                    set({
                        token: null,
                        identity: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                } catch (error) {
                    console.error('[authStore] Logout failed:', error);
                    set({
                        error: error instanceof Error ? error.message : 'Failed to logout',
                        isLoading: false,
                    });
                }
            },

            validateSession: async () => {
                console.log('[authStore] Validating session...');
                const { token } = get();
                if (!token) {
                    console.log('[authStore] No token found, clearing session');
                    set({
                        isAuthenticated: false,
                        identity: null,
                    });
                    return;
                }

                try {
                    console.log('[authStore] Validating token...');
                    const isValid = await validateToken(token);
                    if (!isValid) {
                        console.log('[authStore] Token invalid, clearing session');
                        // Token is invalid, clear the session
                        set({
                            token: null,
                            identity: null,
                            isAuthenticated: false,
                        });
                        return;
                    }

                    console.log('[authStore] Token valid, refreshing user info...');
                    // Refresh user info
                    const identity = await getUserInfo(token);
                    console.log('[authStore] Session validation successful');
                    set({
                        identity,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    console.error('[authStore] Session validation failed:', error);
                    // Error validating token, clear the session
                    set({
                        token: null,
                        identity: null,
                        isAuthenticated: false,
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                identity: state.identity,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);