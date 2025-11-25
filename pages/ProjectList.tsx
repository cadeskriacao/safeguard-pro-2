import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { IconBuilding, IconPlusCircle, IconEdit, IconTrash } from '../components/Icons';
import { getProjects, deleteProject } from '../services/projectService';
import { Project } from '../types';

const ProjectList: React.FC = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir esta obra?')) {
            await deleteProject(id);
            fetchProjects(); // Refresh list
        }
    };

    const handleEdit = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        navigate(APP_ROUTES.PROJECT_EDIT.replace(':id', id));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Minhas Obras</h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Gerencie o progresso e a segurança dos canteiros.</p>
                </div>
                <button
                    onClick={() => navigate(APP_ROUTES.PROJECT_NEW)}
                    className="bg-gradient-emerald-dark text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                    <IconPlusCircle className="w-5 h-5" /> Nova Obra
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(APP_ROUTES.PROJECT_DETAILS.replace(':id', project.id))}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-emerald-100 dark:hover:border-emerald-900 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                            <div>
                                <div className="h-40 bg-gray-50 dark:bg-slate-800 relative group-hover:bg-gradient-emerald-soft dark:group-hover:bg-emerald-900/20 transition-all flex items-center justify-center">
                                    <IconBuilding className="w-16 h-16 text-gray-300 dark:text-slate-600 group-hover:text-emerald-300 dark:group-hover:text-emerald-500 transition-colors" />

                                    {/* Floating Actions */}
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleEdit(e, project.id)}
                                            className="p-2 bg-white dark:bg-slate-700 rounded-full text-emerald-600 dark:text-emerald-400 shadow-md hover:bg-emerald-50 dark:hover:bg-slate-600"
                                            title="Editar"
                                        >
                                            <IconEdit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, project.id)}
                                            className="p-2 bg-white dark:bg-slate-700 rounded-full text-red-500 dark:text-red-400 shadow-md hover:bg-red-50 dark:hover:bg-slate-600"
                                            title="Excluir"
                                        >
                                            <IconTrash className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-4 left-6 right-6">
                                        <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-slate-500 mb-2 uppercase">
                                            <span>Progresso</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-emerald-main rounded-full shadow-sm"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${project.status === 'Ativo' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                                            }`}>
                                            {project.status}
                                        </span>
                                        {project.safetyScore >= 90 && (
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Seguro
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-900 dark:group-hover:text-emerald-400 transition-colors">{project.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{project.address}</p>
                                </div>
                            </div>

                            <div className="px-8 pb-8 pt-0">
                                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-800">
                                    <div className="text-xs">
                                        <span className="text-gray-400 dark:text-slate-500 block mb-1 uppercase font-bold">Safety Score</span>
                                        <span className={`font-bold text-2xl ${project.safetyScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'
                                            }`}>{project.safetyScore}%</span>
                                    </div>
                                    <div className="text-right text-xs">
                                        <span className="text-gray-400 dark:text-slate-500 block mb-1 uppercase font-bold">Gestor</span>
                                        <span className="font-bold text-gray-700 dark:text-slate-300">{project.manager}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State Card to create new project */}
                    <div
                        onClick={() => navigate(APP_ROUTES.PROJECT_NEW)}
                        className="bg-gray-50 dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-slate-800 transition-all text-gray-400 dark:text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                        <IconPlusCircle className="w-12 h-12 mb-4" />
                        <span className="font-bold">Cadastrar Nova Obra</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectList;