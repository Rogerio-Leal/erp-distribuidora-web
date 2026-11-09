import { api } from './api';

export interface Supplier {
    id: string;
    companyName: string;
    document: string;
    type: 'PF' | 'PJ';
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    notes?: string;
    active: boolean;
}

export type CreateSupplierData = Omit<Supplier, 'id' | 'active'>;

export const suppliersService = {
    getAll: async () => {
        const response = await api.get<Supplier[]>('/suppliers');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Supplier>(`/suppliers/${id}`);
        return response.data;
    },

    create: async (data: CreateSupplierData) => {
        const response = await api.post<Supplier>('/suppliers', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateSupplierData>) => {
        const response = await api.patch<Supplier>(`/suppliers/${id}`, data); return response.data;
    }, delete: async (id: string) => {
        await api.delete(`/suppliers/${id}`);
    }
};