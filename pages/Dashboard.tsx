import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { IconAlertTriangle, IconSearch, IconPlusCircle } from '../components/Icons';
import { APP_ROUTES } from '../constants';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock Data
  const ncData = [
    { name: 'Conforme', value: 75 },
    { name: 'Não Conforme', value: 25 },
  ];
  
  const COLORS = ['#10b981', '#1f2937']; // Emerald-500, Gray-800

  const aprData = [
    { name: 'S', aprs: 4 },
    { name: 'M', aprs: 6 },
    { name: 'T', aprs: 3 },
    { name: 'W', aprs: 8 },
    { name: 'T', aprs: 5 },
    { name: 'F', aprs: 9 },
    { name: 'S', aprs: 2 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96">
            <IconSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
                type="text" 
                placeholder="Buscar obra, APR ou inspeção..." 
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all hover:shadow-md border border-transparent dark:border-slate-800"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded">⌘ K</div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
            <button 
                onClick={() => navigate(APP_ROUTES.PROJECTS)}
                className="bg-gradient-emerald-dark text-white px-6 py-4 rounded-full font-bold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
            >
                <IconPlusCircle className="w-5 h-5"/>
                Nova Obra
            </button>
            <button className="bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 px-6 py-4 rounded-full font-bold text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors hidden md:block">
                Exportar Dados
            </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Visão geral da segurança e conformidade das obras.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Main Highlight Card with Gradient Token */}
        <div className="bg-gradient-emerald-dark p-8 rounded-[2rem] text-white relative overflow-hidden group shadow-xl shadow-emerald-900/30">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
          </div>
          <div className="flex justify-between items-start relative z-10">
             <div>
                <p className="text-emerald-200 font-medium mb-1">Total Inspeções</p>
                <h3 className="text-5xl font-bold tracking-tight">24</h3>
             </div>
             <div className="w-10 h-10 rounded-full border border-emerald-500/30 bg-white/10 flex items-center justify-center group-hover:bg-emerald-800 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-emerald-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
             </div>
          </div>
          <div className="mt-8 inline-flex items-center gap-2 bg-emerald-800/50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-700 backdrop-blur-sm">
             <span className="text-emerald-300">↑ 5</span>
             <span>Aumento esse mês</span>
          </div>
        </div>

        {/* Status Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm relative group border border-gray-100/50 dark:border-slate-800 hover:shadow-md transition-all">
           <div className="flex justify-between items-start">
             <div>
                <p className="text-gray-500 dark:text-slate-400 font-medium mb-1">APRs Ativas</p>
                <h3 className="text-5xl font-bold text-gray-900 dark:text-white">10</h3>
             </div>
             <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-slate-800 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
             </div>
          </div>
           <div className="mt-8 inline-flex items-center gap-2 bg-gray-50 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-slate-400">
             <span className="text-emerald-600 dark:text-emerald-400">↑ 12%</span>
             <span>Produtividade</span>
          </div>
        </div>

        {/* Status Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm relative group border border-gray-100/50 dark:border-slate-800 hover:shadow-md transition-all">
           <div className="flex justify-between items-start">
             <div>
                <p className="text-gray-500 dark:text-slate-400 font-medium mb-1">Risco Iminente</p>
                <h3 className="text-5xl font-bold text-gray-900 dark:text-white">2</h3>
             </div>
             <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-slate-800 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
             </div>
          </div>
           <div className="mt-8 inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full text-xs font-bold text-red-600 dark:text-red-400">
             <span>Ação Necessária</span>
          </div>
        </div>

        {/* Status Card 3 */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm relative group border border-gray-100/50 dark:border-slate-800 hover:shadow-md transition-all">
           <div className="flex justify-between items-start">
             <div>
                <p className="text-gray-500 dark:text-slate-400 font-medium mb-1">Conformidade</p>
                <h3 className="text-5xl font-bold text-gray-900 dark:text-white">98%</h3>
             </div>
             <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-gray-50 dark:group-hover:bg-slate-800 transition-colors cursor-pointer">
                <svg className="w-4 h-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
             </div>
          </div>
           <div className="mt-8 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-xs font-medium text-emerald-700 dark:text-emerald-400">
             <span>Meta Atingida</span>
          </div>
        </div>
      </div>

      {/* Analytics & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm lg:col-span-2 border border-gray-100/50 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Análise de APRs (Semanal)</h3>
                <div className="flex gap-2">
                   <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-600 dark:text-slate-300">Vol</span>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aprData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip 
                        cursor={{fill: '#ecfdf5', radius: 8}} 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                    />
                    {/* Using gradient fill definition for chart logic is handled in definition, here we use solid color matching the dark token primary */}
                    <Bar dataKey="aprs" fill="#064e3b" radius={[20, 20, 20, 20]} barSize={40} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Side Widget - Tasks */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm flex flex-col border border-gray-100/50 dark:border-slate-800">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Lembretes</h3>
            </div>
            
            <div className="flex-1 space-y-4">
                {/* FIX: Added dark:bg-none to remove light gradient in dark mode */}
                <div className="p-4 rounded-2xl bg-gradient-emerald-soft dark:bg-none dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50">
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">Reunião DDS</h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-500">07:00 AM - Canteiro Central</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">Auditoria Externa</h4>
                    <p className="text-sm text-gray-500 dark:text-slate-400">14:00 PM - Sala de Reunião</p>
                </div>
            </div>

            <button className="w-full mt-4 bg-gradient-emerald-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/10 hover:shadow-xl hover:scale-[1.02] transition-all">
                Ver Agenda Completa
            </button>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;