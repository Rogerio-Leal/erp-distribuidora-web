import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Supplier, suppliersService } from '../../types/services/suppliers';

export function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchSuppliers() {
            try {
                setLoading(true);
                const data = await suppliersService.getAll();
                setSuppliers(data);
            } catch (error) {
                console.error('Erro ao carregar fornecedores:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchSuppliers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        const confirmed = window.confirm(`Tem certeza que deseja excluir o fornecedor "${name}"?`);
        if (!confirmed) return;

        try {
            await suppliersService.delete(id);
            setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
        } catch (error) {
            console.error('Erro ao excluir fornecedor:', error);
            alert('Não foi possível excluir o fornecedor.');
        }
    };

    const filteredSuppliers = suppliers.filter((supplier) => {
        const term = searchTerm.toLowerCase();
        const nameMatch = supplier.companyName.toLowerCase().includes(term);
        const documentMatch = supplier.document.includes(term);
        return nameMatch || documentMatch;
    });

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-100">Fornecedores</h1>
                    <Link
                        to="/fornecedores/novo"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    >
                        + Novo Fornecedor
                    </Link>
                </div>

                {/* Barra de Busca */}
                <div className="mb-6 flex">
                    <input
                        type="text"
                        placeholder="Buscar fornecedor por nome ou documento..."
                        className="w-full md:w-96 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400">A carregar fornecedores...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900 text-slate-300 text-sm uppercase">
                                    <th className="p-4 border-b border-slate-700">Nome / Razão Social</th>
                                    <th className="p-4 border-b border-slate-700">Documento</th>
                                    <th className="p-4 border-b border-slate-700">Cidade/Estado</th>
                                    <th className="p-4 border-b border-slate-700 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-300">
                                {filteredSuppliers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500">
                                            {searchTerm ? 'Nenhum fornecedor encontrado para esta busca.' : 'Nenhum fornecedor cadastrado ainda.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSuppliers.map((supplier) => (
                                        <tr key={supplier.id} className="hover:bg-slate-750 border-b border-slate-700/50 last:border-0">
                                            <td className="p-4 font-medium">{supplier.companyName}</td>
                                            <td className="p-4 text-slate-400">{supplier.document}</td>
                                            <td className="p-4 text-slate-400">
                                                {supplier.city ? `${supplier.city} - ${supplier.state}` : '-'}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link
                                                    to={`/fornecedores/editar/${supplier.id}`}
                                                    className="text-blue-400 hover:text-blue-300 mr-4 font-medium transition-colors"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(supplier.id, supplier.companyName)}
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