import { create } from 'zustand';
import type { User } from '../auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
    const token = localStorage.getItem('@distribuidora:token');
    const user = localStorage.getItem('@distribuidora:user');

    return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
        isAuthenticated: !!token,

        setAuth: (user, token) => {
            localStorage.setItem('@distribuidora:token', token);
            localStorage.setItem('@distribuidora:user', JSON.stringify(user));
            set({ user, token, isAuthenticated: true });
        },

        logout: () => {
            localStorage.removeItem('@distribuidora:token');
            localStorage.removeItem('@distribuidora:user');
            set({ user: null, token: null, isAuthenticated: false });
        },
    };
});