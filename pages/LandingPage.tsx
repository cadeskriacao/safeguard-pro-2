import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import {
    Shield,
    CheckCircle2,
    BarChart3,
    Users,
    ArrowRight,
    Zap,
    FileText,
    Smartphone,
    Clock,
    AlertTriangle,
    Menu,
    X,
    ChevronRight,
    Play
} from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden relative">
            {/* Noise Overlay */}
            <div className="noise-bg"></div>

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20 relative">
                        {/* Logo */}
                        <div className="flex items-center gap-3 group cursor-pointer z-20" onClick={() => window.scrollTo(0, 0)}>
                            <div className="bg-slate-900 p-2.5 rounded-xl shadow-xl shadow-slate-900/10 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:opacity-80 transition-opacity">
                                Sistema <span className="text-emerald-600">SST</span>
                            </span>
                        </div>

                        {/* Desktop Menu - Centered */}
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="flex bg-white/50 backdrop-blur-md border border-slate-200/50 rounded-full p-1.5 px-2 shadow-sm">
                                {[
                                    { name: 'Funcionalidades', id: 'features' },
                                    { name: 'Benefícios', id: 'benefits' },
                                    { name: 'Começar', id: 'cta' }
                                ].map((item) => (
                                    <a
                                        key={item.name}
                                        href={`#${item.id}`}
                                        onClick={(e) => scrollToSection(e, item.id)}
                                        className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-300"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4 z-20">
                            <button
                                onClick={() => navigate(APP_ROUTES.LOGIN)}
                                className="px-6 py-2.5 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors"
                            >
                                Entrar
                            </button>
                            <button
                                onClick={() => navigate(APP_ROUTES.REGISTER)}
                                className="px-6 py-2.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-0.5 active:scale-95"
                            >
                                Criar Conta
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 z-20"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 p-6 flex flex-col gap-4 shadow-2xl animate-reveal-up">
                        <a href="#features" className="text-xl font-bold text-slate-800" onClick={(e) => scrollToSection(e, 'features')}>Funcionalidades</a>
                        <a href="#benefits" className="text-xl font-bold text-slate-800" onClick={(e) => scrollToSection(e, 'benefits')}>Benefícios</a>
                        <a href="#cta" className="text-xl font-bold text-slate-800" onClick={(e) => scrollToSection(e, 'cta')}>Começar</a>
                        <hr className="border-slate-100 my-2" />
                        <button onClick={() => navigate(APP_ROUTES.LOGIN)} className="text-slate-600 font-bold text-lg text-left">Entrar</button>
                        <button onClick={() => navigate(APP_ROUTES.REGISTER)} className="bg-slate-900 text-white font-bold p-4 rounded-xl text-center shadow-xl">Criar Conta Grátis</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-[120px] animate-float"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-tr from-blue-200/40 to-indigo-200/40 rounded-full blur-[120px] animate-float-delayed"></div>
                </div>

                {/* Background Image with Gradient Mask */}
                {/* Background Image with Gradient Mask */}
                <div className="absolute top-0 right-0 w-2/3 h-full z-0 pointer-events-none">
                    <div
                        className="w-full h-full bg-[url('/hero-bg.png')] bg-cover bg-center opacity-40"
                        style={{
                            maskImage: 'linear-gradient(to right, transparent, black 60%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 60%)'
                        }}
                    ></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pt-32 pb-20">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="text-left relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200/50 mb-8 animate-reveal-up" style={{ animationDelay: '0.1s' }}>
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nova Versão 2.0</span>
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.95] animate-reveal-up" style={{ animationDelay: '0.2s' }}>
                                Menos Papel.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 animate-gradient">
                                    Mais Vida.
                                </span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg animate-reveal-up" style={{ animationDelay: '0.3s' }}>
                                A plataforma de SST que transforma burocracia em segurança real. APRs digitais, inspeções offline e conformidade em tempo real.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 animate-reveal-up" style={{ animationDelay: '0.4s' }}>
                                <button
                                    onClick={() => navigate(APP_ROUTES.REGISTER)}
                                    className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-slate-900/30 hover:shadow-slate-900/50 hover:-translate-y-1 flex items-center justify-center gap-3 group"
                                >
                                    Começar Agora
                                    <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </button>
                                <button className="px-8 py-4 bg-white/50 hover:bg-white text-slate-900 border border-slate-200/50 rounded-2xl font-bold text-lg transition-all backdrop-blur-sm shadow-lg shadow-slate-200/20 hover:shadow-xl flex items-center gap-3 group">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-3 h-3 text-emerald-600 fill-current ml-0.5" />
                                    </div>
                                    Ver Demo
                                </button>
                            </div>

                            <div className="mt-16 pt-8 border-t border-slate-200/60 flex items-center gap-8 animate-reveal-up" style={{ animationDelay: '0.5s' }}>
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-md hover:-translate-y-1 transition-transform duration-300 cursor-pointer z-10 hover:z-20">
                                            <img src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="User" className="w-full h-full rounded-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-md z-0">
                                        +2k
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map(s => <Zap key={s} className="w-4 h-4 text-yellow-400 fill-current" />)}
                                    </div>
                                    <p className="text-sm font-medium text-slate-500">Aprovado por líderes de segurança</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual - Floating Cards */}
                        <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
                            {/* Main Card */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] glass-card p-6 rounded-[2rem] shadow-2xl animate-float z-20">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">Status da Obra</p>
                                            <p className="text-xs text-slate-500">Residencial Alpha</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                                        98% Seguro
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">APR #4029</p>
                                            <p className="text-xs text-slate-500">Trabalho em Altura</p>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Users className="w-5 h-5 text-orange-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">Treinamento</p>
                                            <p className="text-xs text-slate-500">NR-35 Confirmado</p>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-[20%] right-[10%] glass-card p-4 rounded-2xl shadow-xl animate-float-delayed z-30">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-700">Sistema Online</span>
                                </div>
                            </div>

                            <div className="absolute bottom-[20%] left-[0%] glass-card p-5 rounded-2xl shadow-xl animate-float z-30" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-4">
                                    <Smartphone className="w-6 h-6 text-slate-900" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Modo Offline</p>
                                        <p className="text-sm font-bold text-slate-900">Sincronizado</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-[60%] right-[65%] glass-card p-4 rounded-2xl shadow-xl animate-float-delayed z-20" style={{ animationDelay: '2s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                                        <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">+5</div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Equipe</p>
                                        <p className="text-sm font-bold text-slate-900">Ativa Agora</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            < section id="features" className="py-32 relative scroll-mt-20" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-20">
                        <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Funcionalidades <br />
                            <span className="text-emerald-600">Essenciais</span>
                        </h2>
                        <div className="h-1 w-20 bg-emerald-500 rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-10 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-100/50 transition-colors"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-500">
                                    <FileText className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">APRs Digitais</h3>
                                <p className="text-lg text-slate-600 max-w-md leading-relaxed">
                                    Crie, assine e gerencie Análises Preliminares de Risco em segundos. Elimine o papel e garanta a rastreabilidade total.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 text-white hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/4 translate-x-1/4"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                                        <AlertTriangle className="w-7 h-7 text-yellow-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Alertas Inteligentes</h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        Notificações automáticas de vencimentos e não-conformidades críticas.
                                    </p>
                                </div>
                                <div className="mt-8 flex items-center gap-2 text-emerald-400 text-sm font-mono uppercase tracking-widest">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Monitorando
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-10 text-white md:col-span-1 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                                    <Smartphone className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">App Offline</h3>
                                <p className="text-emerald-50 leading-relaxed">
                                    Sua obra não para por falta de internet. Trabalhe offline e sincronize depois.
                                </p>
                            </div>
                        </div>

                        {/* Feature 4 */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-10 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-100/50 transition-colors"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1">
                                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                                        <BarChart3 className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Dashboard Gerencial</h3>
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        Visão completa dos indicadores de segurança. Tome decisões baseadas em dados reais, não em suposições.
                                    </p>
                                </div>
                                <div className="w-full md:w-64 glass-card p-4 rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div className="h-20 w-8 bg-emerald-500 rounded-t-lg opacity-40"></div>
                                            <div className="h-32 w-8 bg-emerald-500 rounded-t-lg opacity-60"></div>
                                            <div className="h-40 w-8 bg-emerald-500 rounded-t-lg"></div>
                                            <div className="h-28 w-8 bg-emerald-500 rounded-t-lg opacity-80"></div>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Benefits / Big Numbers */}
            < section id="benefits" className="py-32 bg-slate-900 text-white relative overflow-hidden scroll-mt-20" >
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/10">
                        <div className="group">
                            <p className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-4 group-hover:scale-110 transition-transform duration-500">50%</p>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Menos Papelada</p>
                        </div>
                        <div className="group">
                            <p className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-4 group-hover:scale-110 transition-transform duration-500 delay-100">3x</p>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mais Agilidade</p>
                        </div>
                        <div className="group">
                            <p className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-4 group-hover:scale-110 transition-transform duration-500 delay-200">100%</p>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Conformidade</p>
                        </div>
                        <div className="group">
                            <p className="text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-4 group-hover:scale-110 transition-transform duration-500 delay-300">24/7</p>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Disponibilidade</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section id="cta" className="py-32 relative overflow-hidden scroll-mt-20" >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/20 group">
                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 group-hover:bg-blue-500/20 transition-colors duration-700"></div>
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">
                                Segurança do Trabalho <br />
                                <span className="text-emerald-400">Reinventada.</span>
                            </h2>
                            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Junte-se a elite dos profissionais de SST. Comece a usar o Sistema SST hoje mesmo e transforme sua gestão.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <button
                                    onClick={() => navigate(APP_ROUTES.REGISTER)}
                                    className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl font-bold text-xl transition-all shadow-lg shadow-emerald-500/25 hover:scale-105 hover:shadow-emerald-500/40"
                                >
                                    Criar Conta Grátis
                                </button>
                            </div>
                            <p className="mt-10 text-sm text-slate-500 font-medium uppercase tracking-widest">
                                Sem cartão de crédito • Setup em 2 minutos
                            </p>
                        </div>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="py-12 bg-white border-t border-slate-200" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-xl">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-slate-900">Sistema SST</span>
                    </div>
                    <div className="text-slate-500 text-sm font-medium">
                        © 2024 Sistema SST. Todos os direitos reservados.
                    </div>
                    <div className="flex gap-8">
                        <a href="#" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">Termos</a>
                        <a href="#" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">Privacidade</a>
                        <a href="#" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">Suporte</a>
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default LandingPage;
