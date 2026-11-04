import { useAuthStore } from '../types/stores/useAuthStore';

export function Dashboard() {
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-2xl font-bold">Painel Principal</h1>
                    <p className="text-slate-400">Bem-vindo, {user?.name} ({user?.role})</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-600/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                    Sair
                </button>
            </div>
        </div>
    );
}