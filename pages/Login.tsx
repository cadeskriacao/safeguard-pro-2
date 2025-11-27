import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { Shield, Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate(APP_ROUTES.HOME);
    } catch (err) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error(err);
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
                "A segurança não é um slogan, é um valor de vida."
              </h2>
              <p className="text-slate-300 text-lg">
                Gerencie sua equipe com a precisão que a vida exige.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border border-slate-900 bg-slate-800 flex items-center justify-center text-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <span>Junte-se a +2.000 especialistas</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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
              <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Bem-vindo de volta</h1>
              <p className="text-slate-500">
                Digite suas credenciais para acessar o painel.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3 animate-shake">
                <div className="p-1 bg-red-100 rounded-full">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-medium">
                    Lembrar de mim
                  </label>
                </div>

                <div className="text-sm">
                  <Link to={APP_ROUTES.FORGOT_PASSWORD} className="font-bold text-emerald-600 hover:text-emerald-500">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Entrar na Plataforma"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Não tem uma conta?{' '}
              <Link to={APP_ROUTES.REGISTER} className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                Criar conta grátis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;