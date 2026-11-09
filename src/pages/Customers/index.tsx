import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Customer, customersService } from '../../types/services/customers';

export function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchCustomers() {
            try {
                setLoading(true);
                const data = await customersService.getAll();
                setCustomers(data);
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCustomers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        const confirmed = window.confirm(`Tem certeza que deseja excluir o cliente "${name}"?`);
        if (!confirmed) return;

        try {
            await customersService.delete(id);
            setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert('Não foi possível excluir o cliente.');
        }
    };

    const filteredCustomers = customers.filter((customer) => {
        const term = searchTerm.toLowerCase();
        const nameMatch = customer.name.toLowerCase().includes(term);
        const documentMatch = customer.document.includes(term);
        return nameMatch || documentMatch;
    });

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-100">Clientes</h1>
                    <Link
                        to="/clientes/novo"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        + Novo Cliente
                    </Link>
                </div>

                {/* Barra de Busca */}
                <div className="mb-6 flex">
                    <input
                        type="text"
                        placeholder="Buscar cliente por nome ou documento..."
                        className="w-full md:w-96 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">A carregar clientes...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-slate-300 text-sm uppercase">
                                    <th className="p-4 border-b border-slate-700">Nome</th>
                                    <th className="p-4 border-b border-slate-700">Documento</th>
                                    <th className="p-4 border-b border-slate-700">Cidade/Estado</th>
                                    <th className="p-4 border-b border-slate-700 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            {searchTerm ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado ainda.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-slate-750 border-b border-slate-700/50 last:border-0">
                                            <td className="p-4 font-medium">{customer.name}</td>
                                            <td className="p-4 text-slate-400">{customer.document}</td>
                                            <td className="p-4 text-slate-400">
                                                {customer.city ? `${customer.city} - ${customer.state}` : '-'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link
                                                    to={`/clientes/editar/${customer.id}`}
                                                    className="text-blue-400 hover:text-blue-300 mr-4 font-medium transition-colors"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(customer.id, customer.name)}
                                                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}