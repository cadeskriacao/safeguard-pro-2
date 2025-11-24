import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconMail, IconArrowLeft } from '../components/Icons';
import { APP_ROUTES } from '../constants';
import { supabase } from '../services/supabaseClient';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#${APP_ROUTES.RESET_PASSWORD}`,
      });

      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-6">
      <Link to={APP_ROUTES.LOGIN} className="inline-flex items-center text-gray-500 dark:text-slate-400 font-bold text-sm mb-8 hover:text-emerald-800 dark:hover:text-emerald-400">
        <IconArrowLeft className="w-4 h-4 mr-2" /> Voltar para Login
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Recuperar Senha</h1>
        <p className="text-gray-500 dark:text-slate-400">Informe seu e-mail para receber as instruções.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-lg border border-gray-100 dark:border-slate-800 transition-colors">
        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">E-mail Cadastrado</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-emerald-dark text-white py-5 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Link'}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
              <IconMail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">E-mail Enviado!</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">Verifique sua caixa de entrada para redefinir a senha.</p>
            <Link to={APP_ROUTES.LOGIN} className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">Voltar para Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;