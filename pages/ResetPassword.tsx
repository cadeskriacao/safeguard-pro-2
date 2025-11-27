import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { APP_ROUTES } from '../constants';
import { supabase } from '../services/supabaseClient';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a session (Supabase automatically logs in via the magic link)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If no session, maybe redirect to login or show error
                // But usually the reset link prov  ides a session
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                navigate(APP_ROUTES.LOGIN);
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Erro ao redefinir senha.');
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
                                "Segurança é um compromisso diário."
                            </h2>
                            <p className="text-slate-300 text-lg">
                                Recupere seu acesso e continue protegendo vidas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
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
                            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Nova Senha</h1>
                            <p className="text-slate-500">
                                Digite sua nova senha abaixo.
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

                        {success ? (
                            <div className="mb-6 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center animate-reveal-up">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Senha Redefinida!</h3>
                                <p className="text-slate-600 mb-6">
                                    Sua senha foi alterada com sucesso. Você será redirecionado para o login.
                                </p>
                                <Link to={APP_ROUTES.LOGIN} className="inline-flex items-center justify-center w-full py-4 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
                                    Ir para Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Nova Senha</label>
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
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Confirmar Nova Senha</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
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
                                        <span className="flex items-center gap-2">
                                            Redefinir Senha <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        )}

                        <p className="mt-8 text-center text-sm text-slate-500">
                            <Link to={APP_ROUTES.LOGIN} className="font-bold text-slate-600 hover:text-slate-900 transition-colors">
                                Voltar para Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
