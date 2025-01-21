import { type Identity } from '@/types/auth';

/**
 * Get OAuth2 token from Chrome Identity API
 */
export const getAuthToken = async (): Promise<string> => {
    console.log('[auth] Requesting auth token...');
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                const error = chrome.runtime.lastError.message;
                console.error('[auth] Failed to get auth token:', error);
                reject(new Error(error));
                return;
            }
            if (!token) {
                console.error('[auth] No token received');
                reject(new Error('Failed to get auth token'));
                return;
            }
            console.log('[auth] Successfully got auth token');
            resolve(token);
        });
    });
};

/**
 * Revoke OAuth2 token
 */
export const revokeAuthToken = async (token: string): Promise<void> => {
    console.log('[auth] Revoking auth token...');
    return new Promise((resolve, reject) => {
        chrome.identity.removeCachedAuthToken({ token }, () => {
            if (chrome.runtime.lastError) {
                const error = chrome.runtime.lastError.message;
                console.error('[auth] Failed to revoke token:', error);
                reject(new Error(error));
                return;
            }
            console.log('[auth] Successfully revoked token');
            resolve();
        });
    });
};

/**
 * Get user info from Google API
 */
export const getUserInfo = async (token: string): Promise<Identity> => {
    console.log('[auth] Fetching user info...');
    try {
        const response = await fetch(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('[auth] Failed to fetch user info:', error);
            throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        console.log('[auth] Successfully fetched user info');
        return {
            id: data.id,
            email: data.email,
            name: data.name,
            picture: data.picture,
        };
    } catch (error) {
        console.error('[auth] Error fetching user info:', error);
        throw error;
    }
};

/**
 * Check if token is valid
 */
export const validateToken = async (token: string): Promise<boolean> => {
    console.log('[auth] Validating token...');
    try {
        const response = await fetch(
            'https://www.googleapis.com/oauth2/v1/tokeninfo',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const isValid = response.ok;
        console.log('[auth] Token validation result:', isValid);
        return isValid;
    } catch (error) {
        console.error('[auth] Error validating token:', error);
        return false;
    }
};