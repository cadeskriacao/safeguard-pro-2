import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconShield, IconLock, IconMail } from '../components/Icons';
import { APP_ROUTES } from '../constants';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate(APP_ROUTES.HOME);
    } else {
      setError(res.message || 'Erro ao entrar');
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md px-6">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-emerald-dark rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/20 mx-auto mb-6 transform -rotate-3">
            <IconShield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo de volta!</h1>
        <p className="text-gray-500 dark:text-slate-400">Entre para gerenciar a segurança da sua obra.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-800 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">E-mail Corporativo</label>
            <div className="relative">
              <IconMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800 dark:text-white"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Senha</label>
                <Link to={APP_ROUTES.FORGOT_PASSWORD} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">Esqueceu?</Link>
             </div>
            <div className="relative">
              <IconLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800 dark:text-white"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-emerald-dark text-white py-5 rounded-2xl font-bold shadow-xl shadow-emerald-900/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Acessar Conta'}
          </button>
        </form>
      </div>

      <p className="text-center mt-8 text-sm text-gray-500 dark:text-slate-400 font-medium">
        Não tem uma conta? <Link to={APP_ROUTES.REGISTER} className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Registre-se</Link>
      </p>

      <div className="text-center mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
        <p className="text-xs text-emerald-800 dark:text-emerald-300">
            <strong>Dica de Acesso:</strong> Use <span className="font-mono bg-white dark:bg-slate-900 px-1 rounded border border-emerald-200 dark:border-slate-700">tst@safeguard.com</span> e <span className="font-mono bg-white dark:bg-slate-900 px-1 rounded border border-emerald-200 dark:border-slate-700">123456</span> para testar.
        </p>
      </div>
    </div>
  );
};

export default Login;