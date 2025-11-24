
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { getInspectionById } from '../services/inspectionService';
import { IconArrowLeft, IconPrinter, IconCheckCircle, IconAlertTriangle, IconCamera } from '../components/Icons';
import { printInspection } from '../utils/printGenerator';
import { Inspection } from '../types';

const InspectionDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inspection, setInspection] = useState<Inspection | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInspection = async () => {
            if (id) {
                setLoading(true);
                const data = await getInspectionById(id);
                setInspection(data);
                setLoading(false);
            }
        };
        fetchInspection();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!inspection) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Inspeção não encontrada</h2>
                <button onClick={() => navigate(APP_ROUTES.INSPECTION_LIST)} className="mt-4 text-emerald-600 font-bold hover:underline">Voltar para a lista</button>
            </div>
        );
    }

    const cCount = inspection.items.filter(i => i.status === 'C').length;
    const ncCount = inspection.items.filter(i => i.status === 'NC').length;
    const naCount = inspection.items.filter(i => i.status === 'NA').length;

    return (
        <div className="pb-20 md:pb-10 max-w-4xl mx-auto space-y-6 animate-fade-in">

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(APP_ROUTES.INSPECTION_LIST)}
                        className="p-2 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <IconArrowLeft className="text-gray-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Relatório de Inspeção</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">
                                {inspection.date} • {inspection.location}
                            </p>
                            {!inspection.hasImminentRisk ? (
                                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Conforme</span>
                            ) : (
                                <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Com Risco</span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => printInspection(inspection)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                >
                    <IconPrinter className="w-4 h-4" /> Exportar PDF
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Itens Avaliados</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{inspection.items.length}</p>
                    </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Conformes</p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{cCount}</p>
                    </div>
                    <IconCheckCircle className="w-8 h-8 text-emerald-200 dark:text-emerald-800" />
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Não Conformes</p>
                        <p className="text-2xl font-bold text-red-700 dark:text-red-300">{ncCount}</p>
                    </div>
                    <IconAlertTriangle className="w-8 h-8 text-red-200 dark:text-red-800" />
                </div>
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Não Aplicável</p>
                        <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{naCount}</p>
                    </div>
                </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="font-bold text-gray-900 dark:text-white">Detalhamento da Inspeção</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-slate-800">
                    {inspection.items.map((item) => (
                        <div key={item.id} className={`p-6 ${item.status === 'NC' ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">{item.question}</p>
                                <div className="shrink-0">
                                    {item.status === 'C' && (
                                        <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-800">Conforme</span>
                                    )}
                                    {item.status === 'NC' && (
                                        <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 px-3 py-1 rounded-lg text-sm font-bold border border-red-200 dark:border-red-800">Não Conforme</span>
                                    )}
                                    {item.status === 'NA' && (
                                        <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-3 py-1 rounded-lg text-sm font-bold">N/A</span>
                                    )}
                                    {!item.status && (
                                        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-lg text-sm font-bold">Pendente</span>
                                    )}
                                </div>
                            </div>

                            {/* Details for NC */}
                            {item.status === 'NC' && (
                                <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl p-4 border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row gap-6">
                                    {item.photoUrl ? (
                                        <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-slate-700">
                                            <img src={item.photoUrl} alt="Evidência" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-full md:w-48 h-32 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 shrink-0">
                                            <div className="text-center">
                                                <IconCamera className="w-6 h-6 mx-auto mb-1" />
                                                <span className="text-xs">Sem foto</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">Gravidade:</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.severity === 'Risco Iminente' ? 'bg-red-600 text-white' :
                                                item.severity === 'Crítico' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>{item.severity}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase block mb-1">Observações:</span>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                "{item.comment || 'Nenhuma observação registrada.'}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase mb-4">Inspetor Responsável</h4>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-800 dark:text-emerald-300 font-bold">
                                {inspection.inspectorName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">{inspection.inspectorName}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Técnico de Segurança</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase mb-4">Assinatura Digital</h4>
                        {inspection.signatureUrl ? (
                            <div className="h-20 border-b border-gray-300 dark:border-slate-600 inline-block min-w-[200px]">
                                <img src={inspection.signatureUrl} alt="Assinatura" className="h-full object-contain" />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Não assinado digitalmente.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default InspectionDetails;
