export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'GERENTE' | 'OPERADOR';
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}