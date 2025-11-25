import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { IconPlusCircle } from '../components/Icons';
import { APRStatus, APR } from '../types';
import { getAPRs } from '../services/aprService';

const APRList: React.FC = () => {
  const navigate = useNavigate();
  const [aprs, setAprs] = useState<APR[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAPRs = async () => {
      setLoading(true);
      const data = await getAPRs();
      setAprs(data);
      setLoading(false);
    };
    fetchAPRs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case APRStatus.APPROVED: return 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800';
      case APRStatus.PENDING_APPROVAL: return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800';
      case APRStatus.REJECTED: return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Minhas APRs</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 hidden md:block">Gerencie suas análises de risco e permissões de trabalho.</p>
        </div>
        <button
          onClick={() => navigate(APP_ROUTES.APR_NEW)}
          className="bg-gradient-emerald-dark text-white px-8 py-4 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <IconPlusCircle /> Nova APR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-slate-400">Carregando APRs...</p>
          </div>
        )}

        {!loading && aprs.length === 0 && (
          <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-gray-500 dark:text-slate-400">Nenhuma APR encontrada.</p>
          </div>
        )}

        {!loading && aprs.length > 0 && aprs.map(apr => (
          <div
            key={apr.id}
            onClick={() => navigate(APP_ROUTES.APR_DETAILS.replace(':id', apr.id))}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-full group hover:border-emerald-100 dark:hover:border-emerald-900"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${getStatusColor(apr.status)}`}>
                  {apr.status}
                </span>
                <span className="text-xs text-gray-400 dark:text-slate-500 font-medium bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-lg">{new Date(apr.date).toLocaleDateString('pt-BR')}</span>
              </div>

              <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-tight">{apr.taskName}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 flex items-center gap-1">📍 {apr.location}</p>
            </div>

            <div className="pt-6 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-emerald-soft dark:bg-emerald-900/30 border border-emerald-50 dark:border-emerald-900/50 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400 shadow-sm">
                  {'CS'}
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">Carlos Silva</span>
              </div>
              <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Ver Detalhes →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APRList;