import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { useAuthStore } from '../types/stores/useAuthStore';
import { Customers } from '../pages/Customers/index';
import { NewCustomer } from '../pages/Customers/New';
import { EditCustomer } from '../pages/Customers/Edit';
import { Suppliers } from '../pages/Suppliers';
import { NewSupplier } from '../pages/Suppliers/New';
import { EditSupplier } from '../pages/Suppliers/Edit';

function PrivateRoute({ children }: { children: ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/clientes"
                    element={
                        <PrivateRoute>
                            <Customers />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/clientes/novo"
                    element={
                        <PrivateRoute>
                            <NewCustomer />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/clientes/editar/:id"
                    element={
                        <PrivateRoute>
                            <EditCustomer />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/fornecedores"
                    element={
                        <PrivateRoute>
                            <Suppliers />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/fornecedores/novo"
                    element={
                        <PrivateRoute>
                            <NewSupplier />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/fornecedores/editar/:id"
                    element={
                        <PrivateRoute>
                            <EditSupplier />
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}