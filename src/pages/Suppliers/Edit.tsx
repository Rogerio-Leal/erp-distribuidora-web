import { useState, useEffect, useRef, type SyntheticEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { suppliersService, type CreateSupplierData } from '../../types/services/suppliers';
import axios from 'axios';

export function EditSupplier() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const numberInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [cep, setCep] = useState('');
    const [number, setNumber] = useState('');
    const [secondaryPhone, setSecondaryPhone] = useState('');

    const [formData, setFormData] = useState<CreateSupplierData>({
        companyName: '',
        document: '',
        type: 'PJ',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        notes: '',
    });

    useEffect(() => {
        async function loadSupplierData() {
            if (!id) return;
            try {
                setFetching(true);
                const data = await suppliersService.getById(id);

                let mainPhone = data.phone || '';
                let secPhone = '';
                if (mainPhone.includes(' / ')) {
                    const parts = mainPhone.split(' / ');
                    mainPhone = parts[0];
                    secPhone = parts[1] || '';
                }

                let rawAddress = data.address || '';
                let extractedNumber = '';
                let extractedCep = '';

                const cepMatch = rawAddress.match(/CEP:\s*(\d{5}-?\d{3})/i) || rawAddress.match(/\b(\d{5}-\d{3})\b/);
                if (cepMatch) {
                    extractedCep = cepMatch[1] || cepMatch[0];
                    rawAddress = rawAddress.replace(/\s*-?\s*CEP:\s*\d{5}-?\d{3}/i, '').replace(/\b\d{5}-\d{3}\b/, '');
                }

                const numMatch = rawAddress.match(/,?\s*Nº\s*([^\s,-]+)/i);
                if (numMatch) {
                    extractedNumber = numMatch[1];
                    rawAddress = rawAddress.replace(/,?\s*Nº\s*[^\s,-]+/i, '');
                }

                rawAddress = rawAddress.trim().replace(/,\s*$/, '');

                setFormData({
                    companyName: data.companyName || '',
                    document: data.document || '',
                    type: data.type || 'PJ',
                    email: data.email || '',
                    phone: mainPhone,
                    address: rawAddress,
                    city: data.city || '',
                    state: data.state || '',
                    notes: data.notes || '',
                });

                setSecondaryPhone(secPhone);
                setNumber(extractedNumber);
                setCep(extractedCep);
            } catch (error) {
                console.error('Erro ao carregar dados do fornecedor:', error);
                alert('Fornecedor não encontrado.');
                navigate('/fornecedores');
            } finally {
                setFetching(false);
            }
        }

        loadSupplierData();
    }, [id, navigate]);

    const handlePhoneChange = (value: string, isSecondary = false) => {
        const numbers = value.replace(/\D/g, '');
        let formatted = numbers;

        if (numbers.length <= 11) {
            formatted = numbers
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d{4})$/, '$1-$2');
        }

        if (isSecondary) {
            setSecondaryPhone(formatted);
        } else {
            setFormData({ ...formData, phone: formatted });
        }
    };

    const handleCepBlur = async () => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setFormData((prev) => ({
                    ...prev,
                    address: `${data.logradouro}, ${data.bairro}`,
                    city: data.localidade,
                    state: data.uf,
                }));

                setTimeout(() => {
                    numberInputRef.current?.focus();
                }, 100);
            } else {
                alert('CEP não encontrado!');
            }
        } catch (error) {
            console.error('Erro ao buscar o CEP:', error);
        }
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        let fullAddress = formData.address;
        if (number) fullAddress += `, Nº ${number}`;
        if (cep) fullAddress += ` - CEP: ${cep}`;

        const payload = {
            ...formData,
            address: fullAddress,
            phone: secondaryPhone ? `${formData.phone} / ${secondaryPhone}` : formData.phone,
            notes: formData.notes?.trim(),
        };

        try {
            setLoading(true);
            await suppliersService.update(id, payload);
            navigate('/fornecedores');
        } catch (error: unknown) {
            console.error('Erro ao atualizar fornecedor:', error);

            if (axios.isAxiosError(error) && error.response?.data) {
                const backendMessage = error.response.data.message;
                if (Array.isArray(backendMessage)) {
                    alert(`Erro de validação:\n- ${backendMessage.join('\n- ')}`);
                } else {
                    alert(backendMessage || 'Erro ao atualizar o fornecedor.');
                }
            } else {
                alert('Ocorreu um erro inesperado ao comunicar com o servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-900 text-slate-100 p-6 text-center">
                A carregar dados do fornecedor...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-100">Editar Fornecedor</h1>
                    <Link to="/fornecedores" className="text-slate-400 hover:text-white transition-colors">
                        Voltar
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Tipo de Pessoa</label>
                            <select
                                disabled
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                value={formData.type}
                                onChange={() => { }}
                            >
                                <option value="PJ">Pessoa Jurídica (CNPJ)</option>
                                <option value="PF">Pessoa Física (CPF)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Nome ou Razão Social *</label>
                            <input
                                type="text"
                                required
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">CPF / CNPJ *</label>
                            <input
                                type="text"
                                required
                                disabled
                                title="O documento não pode ser alterado."
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                value={formData.document}
                                onChange={() => { }}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">E-mail</label>
                            <input
                                type="email"
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Telefone Principal (Celular)</label>
                            <input
                                type="text"
                                maxLength={15}
                                placeholder="(00) 00000-0000"
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={formData.phone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Telefone Secundário (Comercial / Recado)</label>
                            <input
                                type="text"
                                maxLength={15}
                                placeholder="(00) 0000-0000"
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={secondaryPhone}
                                onChange={(e) => handlePhoneChange(e.target.value, true)}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t border-slate-700 my-4 pt-4">
                            <h2 className="text-lg font-semibold text-slate-200 mb-4">Endereço</h2>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">CEP</label>
                            <input
                                type="text"
                                maxLength={9}
                                placeholder="00000-000"
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                onBlur={handleCepBlur}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Rua e Bairro</label>
                            <input
                                type="text"
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Número</label>
                            <input
                                type="text"
                                ref={numberInputRef}
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Cidade</label>
                            <input
                                type="text"
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Estado (UF)</label>
                            <input
                                type="text"
                                maxLength={2}
                                className="bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 border-t border-slate-700 my-4 pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold text-slate-200">Observações Internas</h2>
                                <span className="text-xs text-slate-400">
                                    {(formData.notes?.length || 0)}/500 caracteres
                                </span>
                            </div>

                            <textarea
                                rows={4}
                                maxLength={500}
                                placeholder="Digite anotações internas sobre este cadastro (ex: preferências de faturamento, horários de recebimento, contatos secundários)..."
                                className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-3 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500 resize-none"
                                value={formData.notes || ''}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-md font-medium transition-colors"
                        >
                            {loading ? 'A Salvar...' : 'Atualizar Fornecedor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}