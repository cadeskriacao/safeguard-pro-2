import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, Loader2, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4 lg:p-8">
      <div className="w-full max-w-[1400px] h-[850px] bg-white rounded-[3rem] overflow-hidden shadow-2xl flex relative">

        {/* Left Side - Abstract Visual */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/login-bg.png')] bg-cover bg-center transition-transform duration-[20s] hover:scale-110"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

          <div className="absolute bottom-0 left-0 p-16 text-white z-10">
            <div className="mb-8">
              <div className="w-12 h-1 bg-emerald-500 rounded-full mb-6"></div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                "Comece hoje a transformar a segurança da sua empresa."
              </h2>
              <p className="text-slate-300 text-lg">
                Junte-se a milhares de profissionais que escolheram a excelência.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Acesso completo a todas as ferramentas</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Sem cartão de crédito necessário</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Suporte prioritário 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-12 lg:px-24 relative">
          {/* Mobile Header */}
          <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-900">Sistema SST</span>
          </div>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-10">
              <div className="hidden lg:flex items-center gap-2 mb-8 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                <Shield className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-slate-900">Sistema SST</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Crie sua conta</h1>
              <p className="text-slate-500">
                Preencha os dados abaixo para começar gratuitamente.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3 animate-shake">
                <div className="p-1 bg-red-100 rounded-full">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Nome Completo</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Seu Nome"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Senha</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Defina uma senha forte"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Criar Conta Grátis"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Já tem uma conta?{' '}
              <Link to={APP_ROUTES.LOGIN} className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;