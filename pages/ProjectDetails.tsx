import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { getProjectById } from '../services/projectService';
import { getInspectionsByProjectId } from '../services/inspectionService';
import { Project, Inspection } from '../types';
import { IconArrowLeft, IconPlusCircle, IconClipboard, IconAlertTriangle, IconCheckCircle } from '../components/Icons';

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                setLoading(true);
                const [projectData, inspectionsData] = await Promise.all([
                    getProjectById(id),
                    getInspectionsByProjectId(id)
                ]);
                setProject(projectData);
                setInspections(inspectionsData);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!project) return <div>Obra não encontrada</div>;

    const recentAPRs = [
        { id: '1', task: 'Soldagem em Tubulação', status: 'Aprovada' },
        { id: '2', task: 'Trabalho em Altura', status: 'Aguardando' },
    ];

    return (
        <div className="pb-20 md:pb-0 space-y-6 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(APP_ROUTES.PROJECTS)}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm"
                    >
                        <IconArrowLeft />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{project.name}</h2>
                        <p className="text-sm text-gray-500">{project.address}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase self-start">
                        Score: {project.safetyScore}%
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => navigate(APP_ROUTES.INSPECTION_NEW, { state: { projectId: project.id } })}
                    className="bg-slate-900 text-white p-4 rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                >
                    <div className="bg-yellow-400 text-black p-2 rounded-full">
                        <IconPlusCircle />
                    </div>
                    <span className="font-bold text-sm">Nova Inspeção</span>
                </button>
                <button
                    onClick={() => navigate(APP_ROUTES.APR_NEW)}
                    className="bg-white text-slate-900 border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                    <div className="bg-gray-100 text-slate-900 p-2 rounded-full">
                        <IconClipboard />
                    </div>
                    <span className="font-bold text-sm">Nova APR</span>
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Inspections */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <IconCheckCircle className="text-blue-500 w-5 h-5" /> Últimas Inspeções
                        </h3>
                        <button onClick={() => navigate(APP_ROUTES.INSPECTION_LIST)} className="text-xs text-blue-600 font-bold hover:underline">Ver todas</button>
                    </div>
                    <div className="space-y-3">
                        {inspections.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Nenhuma inspeção realizada.</p>
                        ) : (
                            inspections.map(insp => (
                                <div
                                    key={insp.id}
                                    onClick={() => navigate(APP_ROUTES.INSPECTION_DETAILS.replace(':id', insp.id))}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-bold text-gray-700">{insp.location}</p>
                                        <p className="text-xs text-gray-400">{insp.date}</p>
                                    </div>
                                    {!insp.hasImminentRisk ? (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Conforme</span>
                                    ) : (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold flex items-center gap-1">
                                            <IconAlertTriangle className="w-3 h-3" /> Risco
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent APRs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <IconClipboard className="text-yellow-500 w-5 h-5" /> APRs Recentes
                        </h3>
                        <button onClick={() => navigate(APP_ROUTES.APR_LIST)} className="text-xs text-blue-600 font-bold hover:underline">Ver todas</button>
                    </div>
                    <div className="space-y-3">
                        {recentAPRs.map(apr => (
                            <div key={apr.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">{apr.task}</p>
                                    <p className="text-xs text-gray-400">Em andamento</p>
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${apr.status === 'Aprovada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {apr.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;