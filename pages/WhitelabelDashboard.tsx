
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { APP_ROUTES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard, Users, Construction, FileText, ClipboardList, Map as MapIcon, LogOut, DollarSign, Loader2, TrendingUp } from 'lucide-react';
import ProjectMap from '../components/ProjectMap';

interface MrrData {
    mrr: number;
    currency: string;
    breakdown: Record<string, number>;
    history: Record<string, number>;
}

const WhitelabelDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clientStats, setClientStats] = useState({ total: 0, paying: 0, nonPaying: 0 });
    const [mrrData, setMrrData] = useState<MrrData | null>(null);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = localStorage.getItem('wl_auth');
            if (isAuth !== 'true') {
                navigate(APP_ROUTES.WL_LOGIN);
                return false;
            }
            return true;
        };

        if (checkAuth()) {
            fetchData();
        }
    }, [navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Fetch Client Count (Backend - Admin Role)
            const resCount = await fetch('/api/get-clients-count');
            if (resCount.ok) {
                const dataCount = await resCount.json();
                setClientStats({
                    total: dataCount.count || 0,
                    paying: dataCount.paying || 0,
                    nonPaying: dataCount.nonPaying || 0
                });
            } else {
                console.error('Error fetching count');
            }

            // 2. Fetch MRR (Stripe API via backend)
            const res = await fetch('/api/get-mrr');
            if (res.ok) {
                const data = await res.json();
                setMrrData(data);
            } else {
                console.error('Error fetching MRR');
            }

            // 3. Fetch Whitelabel Stats
            const resStats = await fetch('/api/get-whitelabel-stats');
            if (resStats.ok) {
                setStats(await resStats.json());
            } else {
                console.error('Error fetching whitelabel stats');
            }

        } catch (error) {
            console.error('Dashboard data error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('wl_auth');
        navigate(APP_ROUTES.WL_LOGIN);
    };

    const chartData = mrrData ? Object.entries(mrrData.history).map(([name, value]) => ({
        name,
        amount: value
    })) : [];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(val);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">Whitelabel Dashboard</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Clients Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                        <div className="p-4 rounded-full bg-blue-50 mr-4">
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Clientes Cadastrados</p>
                            <h3 className="text-3xl font-bold text-gray-900">{clientStats.total}</h3>
                            <div className="flex gap-4 mt-2 text-sm">
                                <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                                    {clientStats.paying} Pagantes
                                </span>
                                <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                    {clientStats.nonPaying} Gratuitos
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MRR Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                        <div className="p-4 rounded-full bg-green-50 mr-4">
                            <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Receita Recorrente Mensal (MRR)</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {mrrData ? formatCurrency(mrrData.mrr) : 'R$ 0,00'}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Evolução do MRR (Últimos 12 Meses)</h3>
                    <div className="h-80 w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val} `} />
                                    <Tooltip
                                        formatter={(val: number) => formatCurrency(val)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell - ${index} `} fill={index % 2 === 0 ? '#3B82F6' : '#60A5FA'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Nenhum dado de receita disponível no momento.
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary KPIs (Obras, APRs, Inspeções) */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">Métricas Operacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total de Obras</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats?.totalProjects || 0}</h3>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total de APRs</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats?.totalAprs || 0}</h3>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">Total de Inspeções</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats?.totalInspections || 0}</h3>
                    </div>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Mapa de Obras (Por Estado)</h3>
                    <div className="flex items-center gap-2 mb-4">
                        <MapIcon className="w-5 h-5 text-gray-400" />
                        <h3 className="text-gray-500 font-medium">Localização das Obras</h3>
                    </div>
                    <div className="h-[400px] w-full">
                        <ProjectMap locations={stats?.locations || []} />
                    </div>
                </div>



            </main>
        </div>
    );
};

export default WhitelabelDashboard;
