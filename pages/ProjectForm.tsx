import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { getProjectById, createProject, updateProject, getProjects } from '../services/projectService';
import { Project } from '../types';
import { IconArrowLeft, IconBuilding, IconLock } from '../components/Icons';
import { useSubscription } from '../hooks/useSubscription';

const ProjectForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cep, setCep] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  const { subscriptionStatus, redirectToCheckout } = useSubscription();
  const [projectCount, setProjectCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const [formData, setFormData] = useState<Project>({
    id: '',
    name: '',
    address: '',
    status: 'Ativo',
    progress: 0,
    safetyScore: 100,
    manager: ''
  });

  const handleCepBlur = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
          }));
        } else {
          alert('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP.');
      } finally {
        setLoadingCep(false);
      }
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        const project = await getProjectById(id);
        if (project) {
          setFormData(project);
        } else {
          alert("Obra não encontrada!");
          navigate(APP_ROUTES.PROJECTS);
        }
      } else {
        // Check limit only on creation
        const projects = await getProjects();
        setProjectCount(projects.length);
      }
    };
    fetchProject();
  }, [id, navigate]);

  useEffect(() => {
    if (!id && subscriptionStatus && subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing' && projectCount >= 1) {
      setLimitReached(true);
    } else {
      setLimitReached(false);
    }
  }, [id, subscriptionStatus, projectCount]);

  const handleChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (id) {
        result = await updateProject(id, formData);
      } else {
        result = await createProject(formData);
      }

      if (result.success) {
        alert(id ? 'Obra atualizada com sucesso!' : 'Obra criada com sucesso!');
        navigate(APP_ROUTES.PROJECTS);
      } else {
        alert('Erro ao salvar obra: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado ao salvar obra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 md:pb-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(APP_ROUTES.PROJECTS)}
          className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <IconArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {id ? 'Editar Obra' : 'Nova Obra'}
        </h1>
      </div>

      {limitReached && (
        <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
            <IconLock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-1">Limite do Plano Gratuito Atingido</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
              Você já atingiu o limite de 1 obra do plano gratuito. Faça um upgrade para cadastrar obras ilimitadas.
            </p>
            <button
              onClick={redirectToCheckout}
              type="button"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors text-sm"
            >
              Fazer Upgrade Agora ($10/mês)
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-6 transition-colors ${limitReached ? 'opacity-50 pointer-events-none grayscale' : ''}`}>

        <div>
          <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nome da Obra</label>
          <input
            type="text"
            required
            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-800 dark:text-white"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="Ex: Residencial Solar"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">CEP</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-800 dark:text-white"
                value={cep}
                onChange={e => setCep(e.target.value)}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                maxLength={9}
              />
              {loadingCep && (
                <div className="absolute right-4 top-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Endereço</label>
            <input
              type="text"
              required
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-gray-800 dark:text-white"
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="Ex: Rua das Flores, 123"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Gestor Responsável</label>
            <input
              type="text"
              required
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-gray-800 dark:text-white"
              value={formData.manager}
              onChange={e => handleChange('manager', e.target.value)}
              placeholder="Nome do Gestor"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Status</label>
            <select
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium h-[58px] text-gray-800 dark:text-white"
              value={formData.status}
              onChange={e => handleChange('status', e.target.value)}
            >
              <option value="Ativo">Ativo</option>
              <option value="Pausado">Pausado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>

        {/* FIX: Added dark:bg-none to remove light gradient in dark mode */}
        <div className="bg-gradient-emerald-soft dark:bg-none dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Evolução da Obra</label>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formData.progress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="w-full h-3 bg-emerald-200 dark:bg-emerald-900 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            value={formData.progress}
            onChange={e => handleChange('progress', parseInt(e.target.value))}
          />
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 text-right">Arraste para atualizar o progresso físico</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-emerald-dark text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-emerald-800 transition-all text-lg mt-4 disabled:opacity-70"
        >
          {loading ? 'Salvando...' : 'Salvar Dados'}
        </button>

      </form>
    </div>
  );
};

export default ProjectForm;