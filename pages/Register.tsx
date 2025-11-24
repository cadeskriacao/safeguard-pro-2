import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconShield, IconLock, IconMail, IconUser } from '../components/Icons';
import { APP_ROUTES } from '../constants';
import { supabase } from '../services/supabaseClient';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'TST', // Default role
          },
        },
      });

      if (error) throw error;

      // For now, redirect to login. In a real app, you might show a "Check your email" message.
      navigate(APP_ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-6 my-10">
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-800 dark:text-emerald-400 shadow-md mx-auto mb-4 border border-emerald-100 dark:border-slate-800">
          <IconShield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Crie sua Conta</h1>
        <p className="text-gray-500 dark:text-slate-400 text-sm">Junte-se ao SafeGuard Pro.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-800 transition-colors">
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Nome Completo</label>
            <div className="relative">
              <IconUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800 dark:text-white"
                placeholder="Seu Nome"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">E-mail</label>
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
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Senha</label>
            <div className="relative">
              <IconLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800 dark:text-white"
                placeholder="Defina uma senha forte"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-bold shadow-lg hover:bg-emerald-800 dark:hover:bg-emerald-700 transition-all text-lg disabled:opacity-50 mt-4"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
      </div>

      <p className="text-center mt-8 text-sm text-gray-500 dark:text-slate-400 font-medium">
        Já tem cadastro? <Link to={APP_ROUTES.LOGIN} className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Fazer Login</Link>
      </p>
    </div>
  );
};

export default Register;