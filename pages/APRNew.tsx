import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { RiskControl } from '../types';
import { suggestRisksAndControls } from '../services/geminiService';
import { IconSparkles, IconClipboard, IconPlusCircle, IconTrash } from '../components/Icons';

const APRNew: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Form State
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [risks, setRisks] = useState<RiskControl[]>([]);
  const [team, setTeam] = useState(['Carlos Silva']); 

  const handleAISuggestion = async () => {
    if (!description) return alert("Descreva a atividade primeiro.");
    setLoadingAI(true);
    const suggestions = await suggestRisksAndControls(description);
    setRisks(suggestions);
    setLoadingAI(false);
  };

  const handleAddManualRisk = () => {
    setRisks([...risks, { risk: '', control: '', ppe: [] }]);
  };

  const handleRemoveRisk = (index: number) => {
    const newRisks = risks.filter((_, i) => i !== index);
    setRisks(newRisks);
  };

  const handleUpdateRisk = (index: number, field: keyof RiskControl, value: any) => {
    const newRisks = [...risks];
    newRisks[index] = { ...newRisks[index], [field]: value };
    setRisks(newRisks);
  };

  const handleFinish = () => {
    alert("APR Enviada para aprovação!");
    navigate(APP_ROUTES.APR_LIST);
  };

  return (
    <div className="pb-20 min-h-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="flex gap-3 mb-10">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-fade-in">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dados da Atividade</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Preencha as informações básicas para iniciar.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 space-y-6 transition-colors">
            <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nome da Tarefa</label>
                <input 
                type="text" 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800 dark:text-white"
                placeholder="Ex: Manutenção Elétrica"
                value={taskName}
                onChange={e => setTaskName(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Local</label>
                <input 
                type="text" 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800 dark:text-white"
                placeholder="Ex: Galpão B"
                value={location}
                onChange={e => setLocation(e.target.value)}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Descrição Detalhada</label>
                <textarea 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800 dark:text-white resize-none"
                placeholder="Descreva o passo a passo da atividade..."
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                />
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            disabled={!taskName || !description}
            className="w-full bg-emerald-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-bold shadow-lg disabled:opacity-50 mt-4 hover:bg-emerald-800 dark:hover:bg-emerald-700 transition-all transform hover:-translate-y-1"
          >
            Próximo Passo
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Análise de Riscos</h2>
                <p className="text-gray-500 dark:text-slate-400 mt-2">Edite os riscos sugeridos ou adicione novos.</p>
            </div>
            <button 
                onClick={handleAISuggestion}
                disabled={loadingAI}
                className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 border border-purple-100 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
                {loadingAI ? 'Processando...' : <><IconSparkles className="w-4 h-4" /> Sugerir IA</>}
            </button>
          </div>

          <div className="space-y-6">
            {risks.length === 0 && !loadingAI && (
               <div className="text-center py-16 text-gray-400 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900">
                 <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-gray-300 dark:text-slate-600">
                    <IconClipboard className="w-8 h-8" />
                 </div>
                 <p className="text-lg font-bold text-gray-700 dark:text-gray-200">Comece a Análise</p>
                 <p className="text-sm mb-6">Use a IA para gerar sugestões ou adicione manualmente.</p>
                 <button 
                  onClick={handleAddManualRisk}
                  className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                 >
                   + Adicionar Manualmente
                 </button>
               </div>
            )}
            
            {risks.map((risk, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors relative group">
                
                <button 
                  onClick={() => handleRemoveRisk(index)}
                  className="absolute top-6 right-6 text-gray-300 dark:text-slate-600 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <IconTrash className="w-5 h-5" />
                </button>

                <div className="space-y-5 pr-8">
                  <div>
                    <label className="block text-xs font-bold text-red-500 uppercase mb-2">Perigo / Risco</label>
                    <input 
                      type="text" 
                      value={risk.risk}
                      onChange={(e) => handleUpdateRisk(index, 'risk', e.target.value)}
                      placeholder="Ex: Queda de nível"
                      className="w-full p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 focus:ring-1 focus:ring-red-400 outline-none font-bold text-gray-800 dark:text-red-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase mb-2">Medidas de Controle</label>
                    <textarea 
                      value={risk.control}
                      onChange={(e) => handleUpdateRisk(index, 'control', e.target.value)}
                      placeholder="Ex: Instalação de linha de vida..."
                      rows={2}
                      className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 focus:ring-1 focus:ring-emerald-400 outline-none text-sm font-medium text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase mb-2">EPIs (Separar por vírgula)</label>
                    <input 
                      type="text" 
                      value={risk.ppe.join(', ')}
                      onChange={(e) => handleUpdateRisk(index, 'ppe', e.target.value.split(',').map(s => s.trim()))}
                      placeholder="Ex: Capacete, Luvas, Óculos"
                      className="w-full p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 focus:ring-1 focus:ring-blue-400 outline-none text-sm text-blue-800 dark:text-blue-300 font-medium"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {risks.length > 0 && (
               <button 
                onClick={handleAddManualRisk}
                className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl text-gray-500 dark:text-slate-400 font-bold hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all flex items-center justify-center gap-2"
               >
                 <IconPlusCircle className="w-5 h-5" /> Adicionar Outro Risco
               </button>
            )}

          </div>

          <div className="flex gap-4 pt-6">
             <button onClick={() => setStep(1)} className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-white py-4 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Voltar</button>
             <button 
              onClick={() => setStep(3)} 
              disabled={risks.length === 0}
              className="flex-1 bg-emerald-900 dark:bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-800 dark:hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50"
             >
               Próximo
             </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Validação da Equipe</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-2">Colete as assinaturas digitais antes de finalizar.</p>
          </div>
          
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/50 text-sm text-emerald-900 dark:text-emerald-200 flex gap-4 items-start">
            <IconClipboard className="w-6 h-6 shrink-0 mt-1" />
            <div>
                <strong className="block text-base mb-1">Termo de Responsabilidade</strong>
                Ao assinar, declaro estar ciente dos riscos e treinado nas medidas de controle listados para esta atividade.
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden p-2">
            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-t-2xl border-b border-gray-100 dark:border-slate-700">
                <h3 className="font-bold text-xs text-gray-400 dark:text-slate-500 uppercase tracking-wider">Equipe Executora</h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {team.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center font-bold text-emerald-800 dark:text-emerald-300">
                                {member.charAt(0)}
                            </div>
                            <span className="text-base font-bold text-gray-800 dark:text-white">{member}</span>
                        </div>
                        <span className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Assinado</span>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
                <button className="w-full py-3 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-gray-500 dark:text-slate-400 text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all">
                    + Adicionar Colaborador
                </button>
            </div>
          </div>

          <div className="pt-8 space-y-3">
             <button 
                onClick={handleFinish} 
                className="w-full bg-emerald-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-emerald-800 dark:hover:bg-emerald-700 transition-all transform hover:-translate-y-1 text-lg"
             >
                Finalizar e Enviar APR
             </button>
             <button onClick={() => setStep(2)} className="w-full text-gray-400 text-sm font-bold hover:text-gray-600 dark:hover:text-gray-200">Voltar para Riscos</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default APRNew;