import { useAuthStore } from '@/store/authStore';

export function LoginButton() {
    const { login, logout, isAuthenticated, isLoading } = useAuthStore();

    const handleLogin = async () => {
        console.log('[LoginButton] Starting login...');
        try {
            await login();
            console.log('[LoginButton] Login completed');
        } catch (error) {
            console.error('[LoginButton] Login failed:', error);
        }
    };

    const handleLogout = async () => {
        console.log('[LoginButton] Starting logout...');
        try {
            await logout();
            console.log('[LoginButton] Logout completed');
        } catch (error) {
            console.error('[LoginButton] Logout failed:', error);
        }
    };

    if (isLoading) {
        return (
            <button
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md cursor-wait"
                disabled
            >
                <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
                Loading...
            </button>
        );
    }

    if (isAuthenticated) {
        return (
            <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
                Sign Out
            </button>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
            <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
            </svg>
            Sign in with Google
        </button>
    );
}