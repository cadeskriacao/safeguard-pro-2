import React, { useState, useRef, useEffect } from 'react';
import { MOCK_INSPECTION_TEMPLATE, APP_ROUTES, CURRENT_USER } from '../constants';
import { InspectionItem, RiskLevel, Inspection as InspectionType } from '../types';
import { IconCamera, IconAlertTriangle, IconArrowLeft, IconTrash } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { addInspection } from '../services/storageService';
import { compressImage } from '../utils/imageHelper';

const Inspection: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InspectionItem[]>(JSON.parse(JSON.stringify(MOCK_INSPECTION_TEMPLATE)));
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  
  // Signature State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }
    }
  }, []);

  // Drawing Functions
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Prevent scrolling when touching canvas
    if ('touches' in e) {
      // e.preventDefault(); 
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.closePath();
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    }
  };

  const handleStatusChange = (id: string, status: 'C' | 'NC' | 'NA') => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return { ...item, status, severity: status === 'NC' ? RiskLevel.BAIXO : undefined };
      }
      return item;
    });
    setItems(newItems);
    if (status === 'NC') {
      setActiveItemId(id);
    } else {
      setActiveItemId(null);
    }
  };

  const handleSeverityChange = (id: string, severity: RiskLevel) => {
    setItems(items.map(item => item.id === id ? { ...item, severity } : item));
  };

  const handlePhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setItems(items.map(item => item.id === id ? { ...item, photoUrl: compressed } : item));
      } catch (error) {
        console.error("Error processing image", error);
        alert("Não foi possível processar a imagem. Tente uma imagem menor.");
      }
    }
  };

  const handleFinish = () => {
    if (!hasSignature) {
        alert("Por favor, assine a inspeção antes de finalizar.");
        return;
    }

    const critical = items.some(i => i.severity === RiskLevel.IMINENTE);
    const signatureUrl = canvasRef.current?.toDataURL();

    const newInspection: InspectionType = {
      id: Date.now().toString(),
      location: 'Obra Alpha', 
      date: new Date().toLocaleString('pt-BR'),
      inspectorName: CURRENT_USER.name,
      items: items,
      hasImminentRisk: critical,
      projectId: '1', 
      signatureUrl: signatureUrl
    };

    const saved = addInspection(newInspection);
    
    if (!saved) {
        alert("⚠️ ERRO: Armazenamento cheio! Não foi possível salvar a inspeção.");
        return;
    }

    if (critical) {
      alert("⚠️ ALERTA: Risco Iminente detectado! Gerência notificada.");
    } else {
      alert("✅ Inspeção salva com sucesso!");
    }
    navigate(APP_ROUTES.INSPECTION_LIST);
  };

  return (
    <div className="pb-24 md:pb-10 max-w-3xl mx-auto">
      {/* Header with Back Button */}
      <div className="bg-white dark:bg-slate-900 p-4 md:p-6 shadow-sm mb-6 sticky top-0 z-10 rounded-b-3xl md:rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate(APP_ROUTES.INSPECTION_LIST)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
                <IconArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Checklist Diário</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Obra Alpha</p>
            </div>
        </div>
        <div className="hidden md:block">
             <span className="text-xs bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full font-bold">Em Andamento</span>
        </div>
      </div>

      <div className="space-y-4 px-4 md:px-0">
        {items.map((item) => (
          <div key={item.id} className={`bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border-2 transition-all duration-300 ${
            item.status === 'C' ? 'border-emerald-500' : 
            item.status === 'NC' ? 'border-red-500' : 
            item.status === 'NA' ? 'border-gray-200 dark:border-slate-700' : 'border-transparent dark:border-slate-800'
          }`}>
            <p className="font-medium text-gray-800 dark:text-white text-lg mb-6 leading-snug">{item.question}</p>
            
            <div className="flex gap-3 mb-2">
              <button 
                onClick={() => handleStatusChange(item.id, 'C')}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold transition-all transform active:scale-95 shadow-sm ${
                  item.status === 'C' ? 'bg-gradient-emerald-main text-white shadow-lg shadow-emerald-200 dark:shadow-none ring-2 ring-emerald-200 dark:ring-emerald-900 ring-offset-2 dark:ring-offset-slate-900' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                Conforme
              </button>
              <button 
                onClick={() => handleStatusChange(item.id, 'NC')}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold transition-all transform active:scale-95 shadow-sm ${
                  item.status === 'NC' ? 'bg-red-600 text-white shadow-lg shadow-red-200 dark:shadow-none ring-2 ring-red-200 dark:ring-red-900 ring-offset-2 dark:ring-offset-slate-900' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                Não Conforme
              </button>
              <button 
                onClick={() => handleStatusChange(item.id, 'NA')}
                className={`flex-1 py-4 rounded-2xl text-sm font-bold transition-all transform active:scale-95 shadow-sm ${
                  item.status === 'NA' ? 'bg-gray-600 text-white shadow-lg shadow-gray-300 dark:shadow-none' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                N/A
              </button>
            </div>

            {/* Evidence & Severity Section */}
            {item.status === 'NC' && (
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 animate-fade-in">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <label className="flex flex-col items-center justify-center h-28 bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors relative overflow-hidden group">
                    {item.photoUrl ? (
                      <img src={item.photoUrl} alt="Evidência" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                           <IconCamera className="w-5 h-5" />
                        </div>
                        <span className="text-xs mt-2 text-gray-500 dark:text-slate-400 font-medium group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Adicionar Foto</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(item.id, e)} />
                  </label>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase ml-1">Gravidade</label>
                    <div className="relative">
                        <select 
                        className="w-full h-28 text-sm p-2 bg-gray-50 dark:bg-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-red-500 outline-none"
                        size={4}
                        value={item.severity}
                        onChange={(e) => handleSeverityChange(item.id, e.target.value as RiskLevel)}
                        >
                        {Object.values(RiskLevel).map(level => (
                            <option key={level} value={level} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer">{level}</option>
                        ))}
                        </select>
                    </div>
                  </div>
                </div>
                
                {item.severity === RiskLevel.IMINENTE && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-2xl text-sm flex items-center gap-3 mb-4 border border-red-200 dark:border-red-900/50 shadow-sm">
                    <IconAlertTriangle className="w-5 h-5" />
                    <strong>PARADA IMEDIATA OBRIGATÓRIA.</strong>
                  </div>
                )}
                
                <textarea 
                  placeholder="Descreva o desvio encontrado em detalhes..."
                  className="w-full text-sm p-4 bg-gray-50 dark:bg-slate-800 dark:text-white rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
        ))}

        {/* Signature Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white">Assinatura do Inspetor</h3>
                {hasSignature && (
                    <button 
                        onClick={clearSignature}
                        className="text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-full transition-colors"
                    >
                        <IconTrash className="w-4 h-4" /> Limpar
                    </button>
                )}
            </div>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-white/80 touch-none relative overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-40 cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                 {!hasSignature && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm font-medium">
                        Assine aqui
                    </div>
                )}
            </div>
        </div>

      </div>

      <div className="p-4 fixed bottom-20 md:bottom-0 left-0 md:left-72 right-0 z-20 bg-gradient-to-t from-[#F3F4F6] dark:from-slate-950 via-[#F3F4F6] dark:via-slate-950 to-transparent md:bg-none pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
             <button 
              onClick={handleFinish}
              className="w-full bg-gradient-emerald-dark text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg"
            >
              Finalizar Inspeção
            </button>
          </div>
      </div>
    </div>
  );
};

export default Inspection;