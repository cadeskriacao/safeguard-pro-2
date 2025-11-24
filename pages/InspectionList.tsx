
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import {
  IconPlusCircle,
  IconCheckCircle,
  IconAlertTriangle,
  IconGrid,
  IconList,
  IconSearch,
  IconFilter,
  IconPrinter,
  IconEye
} from '../components/Icons';
import { printInspection } from '../utils/printGenerator';
import { getInspections } from '../services/inspectionService';
import { Inspection } from '../types';

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'risk' | 'ok';

const InspectionList: React.FC = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspections = async () => {
      setLoading(true);
      const data = await getInspections();
      setInspections(data);
      setLoading(false);
    };
    fetchInspections();
  }, []);

  const filteredInspections = inspections.filter(item => {
    const matchesSearch =
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.inspectorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ? true :
        filterStatus === 'risk' ? item.hasImminentRisk :
          !item.hasImminentRisk;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Inspeções</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Histórico de checklists realizados e novas auditorias.</p>
        </div>
        <button
          onClick={() => navigate(APP_ROUTES.INSPECTION_NEW)}
          className="w-full md:w-auto bg-gradient-emerald-dark text-white px-8 py-4 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <IconPlusCircle className="w-5 h-5" /> Nova Inspeção
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between gap-4 items-center pl-6 pr-2 py-2 transition-colors">
        <div className="flex flex-1 w-full gap-4 items-center">
          <IconSearch className="text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por local ou inspetor..."
            className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-700 dark:text-white h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="h-8 w-px bg-gray-200 dark:bg-slate-700 hidden md:block"></div>

          <div className="relative hidden md:block">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="appearance-none bg-transparent pr-8 py-2 text-sm font-bold text-gray-600 dark:text-slate-300 focus:outline-none cursor-pointer hover:text-emerald-900 dark:hover:text-emerald-400"
            >
              <option value="all" className="dark:bg-slate-900">Todos os Status</option>
              <option value="risk" className="dark:bg-slate-900">Com Risco</option>
              <option value="ok" className="dark:bg-slate-900">Conformes</option>
            </select>
            <IconFilter className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-3xl transition-colors">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-emerald-900 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}
          >
            <IconGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow text-emerald-900 dark:text-emerald-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'}`}
          >
            <IconList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredInspections.length === 0 ? (
        <div className="p-16 text-center text-gray-400 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-800 transition-colors">
          <p className="font-bold text-lg text-gray-900 dark:text-white">Nenhuma inspeção encontrada</p>
          <p className="text-sm mt-1">Tente ajustar seus filtros de busca.</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInspections.map((item) => {
                const cCount = item.items.filter(i => i.status === 'C').length;
                const ncCount = item.items.filter(i => i.status === 'NC').length;
                const naCount = item.items.filter(i => i.status === 'NA').length;

                return (
                  <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">{item.location}</h3>
                        <p className="text-xs text-gray-400 font-medium">{item.date}</p>
                      </div>
                      {!item.hasImminentRisk ? (
                        <div className="bg-gradient-emerald-soft dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                          <IconCheckCircle className="w-6 h-6" />
                        </div>
                      ) : (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-full animate-pulse border border-red-100 dark:border-red-900/50">
                          <IconAlertTriangle className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800 p-3 rounded-2xl transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm">
                          {item.inspectorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium uppercase">Inspetor</p>
                          <p className="text-sm font-bold text-gray-800 dark:text-white">{item.inspectorName}</p>
                        </div>
                      </div>

                      {/* Status Counts */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-2 text-center border border-emerald-100 dark:border-emerald-900/30">
                          <span className="block text-xs font-bold text-emerald-800 dark:text-emerald-400">C</span>
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{cCount}</span>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-2 text-center border border-red-100 dark:border-red-900/30">
                          <span className="block text-xs font-bold text-red-800 dark:text-red-400">NC</span>
                          <span className="text-lg font-bold text-red-600 dark:text-red-500">{ncCount}</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2 text-center border border-gray-100 dark:border-gray-700">
                          <span className="block text-xs font-bold text-gray-600 dark:text-gray-400">N/A</span>
                          <span className="text-lg font-bold text-gray-500 dark:text-gray-300">{naCount}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(APP_ROUTES.INSPECTION_DETAILS.replace(':id', item.id))}
                          className="flex-1 py-3 text-sm font-bold text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                          <IconEye className="w-4 h-4" /> Detalhes
                        </button>
                        <button
                          onClick={() => printInspection(item)}
                          className="w-12 py-3 text-gray-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-900 dark:hover:text-emerald-400 rounded-xl transition-colors border border-gray-100 dark:border-slate-700 flex items-center justify-center"
                          title="Imprimir PDF"
                        >
                          <IconPrinter className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW */
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden px-4 py-2 transition-colors">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 dark:text-slate-500 text-xs uppercase font-bold border-b border-gray-100 dark:border-slate-800">
                    <th className="px-6 py-6">Status</th>
                    <th className="px-6 py-6">Local</th>
                    <th className="px-6 py-6">Data</th>
                    <th className="px-6 py-6 hidden md:table-cell">Inspetor</th>
                    <th className="px-6 py-6 hidden md:table-cell">Resumo</th>
                    <th className="px-6 py-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {filteredInspections.map((item) => {
                    const cCount = item.items.filter(i => i.status === 'C').length;
                    const ncCount = item.items.filter(i => i.status === 'NC').length;

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer" onClick={() => navigate(APP_ROUTES.INSPECTION_DETAILS.replace(':id', item.id))}>
                        <td className="px-6 py-4">
                          {!item.hasImminentRisk ? (
                            <span className="inline-flex items-center gap-2 bg-gradient-emerald-soft dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div> OK
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-3 py-1 rounded-full font-bold">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Risco
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                          {item.location}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                              {item.inspectorName.charAt(0)}
                            </div>
                            {item.inspectorName}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex gap-2 text-xs font-bold">
                            <span className="text-emerald-600">C: {cCount}</span>
                            <span className="text-red-600">NC: {ncCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              printInspection(item);
                            }}
                            className="text-gray-400 dark:text-slate-500 hover:text-emerald-900 dark:hover:text-emerald-400 p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                          >
                            <IconPrinter className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InspectionList;
