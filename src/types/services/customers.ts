import { api } from './api';

export interface Customer {
    id: string;
    name: string;
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

export type CreateCustomerData = Omit<Customer, 'id' | 'active'>;

export const customersService = {

    getAll: async () => {
        const response = await api.get<Customer[]>('/customers');
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Customer>(`/customers/${id}`);
        return response.data;
    },

    create: async (data: CreateCustomerData) => {
        const response = await api.post<Customer>('/customers', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateCustomerData>) => {
        const response = await api.patch<Customer>(`/customers/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/customers/${id}`);
    }
};