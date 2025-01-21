export interface Identity {
    id: string;
    email: string;
    name: string;
    picture: string;
}

export interface AuthState {
    token: string | null;
    identity: Identity | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}