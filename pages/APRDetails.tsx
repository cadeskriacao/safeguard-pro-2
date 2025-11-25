import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { IconArrowLeft, IconPrinter, IconCheckCircle, IconAlertTriangle, IconUser, IconClipboard } from '../components/Icons';
import { APRStatus, APR } from '../types';
import { printAPR } from '../utils/printGenerator';
import { getAPRById } from '../services/aprService';

const APRDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apr, setApr] = useState<APR | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAPR = async () => {
            if (id) {
                setLoading(true);
                const data = await getAPRById(id);
                setApr(data);
                setLoading(false);
            }
        };
        fetchAPR();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-slate-400">Carregando APR...</p>
                </div>
            </div>
        );
    }

    if (!apr) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">APR não encontrada</h2>
                <button onClick={() => navigate(APP_ROUTES.APR_LIST)} className="mt-4 text-blue-600 dark:text-blue-400 underline">Voltar para a lista</button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case APRStatus.APPROVED:
                return <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><IconCheckCircle className="w-4 h-4" /> Aprovada</span>;
            case APRStatus.PENDING_APPROVAL:
                return <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1">⏱️ Aguardando Aprovação</span>;
            case APRStatus.REJECTED:
                return <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1"><IconAlertTriangle className="w-4 h-4" /> Rejeitada</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold uppercase">Rascunho</span>;
        }
    };

    return (
        <div className="pb-20 md:pb-10 max-w-4xl mx-auto space-y-6 animate-fade-in">

            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(APP_ROUTES.APR_LIST)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <IconArrowLeft />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">APR #{apr.id} - {apr.taskName}</h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <span>📅 {apr.date}</span>
                            <span className="text-gray-300">|</span>
                            <span>📍 {apr.location}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {getStatusBadge(apr.status)}
                    <button
                        onClick={() => printAPR(apr)}
                        className="p-2 text-gray-500 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors ml-auto md:ml-0"
                        title="Imprimir / Salvar PDF"
                    >
                        <IconPrinter />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Content - Risks */}
                <div className="md:col-span-2 space-y-6">

                    {/* Description Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                            <IconClipboard className="w-4 h-4" /> Descrição da Atividade
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {apr.description}
                        </p>
                    </div>

                    {/* Risks List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800">Análise de Riscos e Controles</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {apr.risks.length > 0 ? apr.risks.map((item, idx) => (
                                <div key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 mt-1">Risco</span>
                                        <p className="font-bold text-gray-800">{item.risk}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-0 md:pl-12">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Medidas de Controle</span>
                                            <p className="text-sm text-gray-600">{item.control}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase block mb-1">EPIs Obrigatórios</span>
                                            <div className="flex flex-wrap gap-1">
                                                {item.ppe.map((p, i) => (
                                                    <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-gray-400 italic">Nenhum risco registrado.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Signatures & Info */}
                <div className="space-y-6">

                    {/* Project Info */}
                    <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg">
                        <h3 className="text-xs font-bold text-yellow-400 uppercase mb-2">Projeto Vinculado</h3>
                        <p className="font-bold text-lg mb-1">Obra Alpha</p>
                        <p className="text-xs text-gray-400">Av. das Nações, 1500</p>
                    </div>

                    {/* Team Signatures */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 text-sm">Equipe Executora</h3>
                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">{apr.teamSignatures.length}</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {apr.teamSignatures.map((sig, idx) => (
                                <div key={idx} className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                                            <IconUser className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">{sig.name}</p>
                                            <p className="text-xs text-gray-400">{sig.role}</p>
                                        </div>
                                    </div>
                                    {sig.signed ? (
                                        <IconCheckCircle className="text-green-500 w-5 h-5" />
                                    ) : (
                                        <span className="text-xs text-gray-400 italic">Pendente</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Approval Workflow */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="font-bold text-gray-800 text-sm">Aprovação TST/Gestor</h3>
                        </div>
                        <div className="p-4">
                            {apr.approverSignature ? (
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-12 rounded-full ${apr.approverSignature.signed ? 'bg-green-500' : 'bg-yellow-400'}`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{apr.approverSignature.name}</p>
                                        <p className="text-xs text-gray-500">{apr.approverSignature.role}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                                            {apr.approverSignature.signed ? `Assinado em ${apr.approverSignature.date}` : 'Aguardando Assinatura'}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Nenhum aprovador designado.</p>
                            )}
                        </div>

                        {apr.status === APRStatus.PENDING_APPROVAL && (
                            <div className="p-3 bg-yellow-50 border-t border-yellow-100">
                                <button className="w-full bg-green-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm mb-2">
                                    Aprovar APR Digitalmente
                                </button>
                                <button className="w-full bg-white text-red-600 border border-red-200 text-sm font-bold py-2 rounded-lg hover:bg-red-50 transition-colors">
                                    Rejeitar / Solicitar Ajuste
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default APRDetails;
