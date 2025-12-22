import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, CURRENT_USER } from '../constants';
import { logout, updateProfile, changePassword, getCurrentUser } from '../services/authService';
import {
   IconUser,
   IconLogOut,
   IconBell,
   IconMoon,
   IconShield,
   IconCheckCircle,
   IconAlertTriangle,
   IconEdit,
   IconLock,
   IconCreditCard
} from '../components/Icons';
import { useSubscription } from '../hooks/useSubscription';

const Profile: React.FC = () => {
   const navigate = useNavigate();
   const [notifications, setNotifications] = useState(true);
   const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem('theme') === 'dark';
   });

   // Edit State
   const [isEditing, setIsEditing] = useState(false);
   const [user, setUser] = useState(getCurrentUser() || CURRENT_USER);
   const [editName, setEditName] = useState(user.name);
   const [editEmail, setEditEmail] = useState('tst@safeguard.com'); // Mock
   const [oldPass, setOldPass] = useState('');
   const [newPass, setNewPass] = useState('');
   const [msg, setMsg] = useState('');

   const { subscriptionStatus, redirectToPortal, redirectToCheckout } = useSubscription();

   // Apply Dark Mode
   useEffect(() => {
      if (darkMode) {
         document.documentElement.classList.add('dark');
         localStorage.setItem('theme', 'dark');
      } else {
         document.documentElement.classList.remove('dark');
         localStorage.setItem('theme', 'light');
      }
   }, [darkMode]);

   const handleLogout = () => {
      logout();
      navigate(APP_ROUTES.LOGIN);
   };

   const handleSaveProfile = async () => {
      await updateProfile({ name: editName });
      setUser({ ...user, name: editName });

      if (newPass) {
         const res = await changePassword(oldPass, newPass);
         setMsg(res.message);
         if (!res.success) return;
      }

      setMsg('Perfil atualizado com sucesso!');
      setTimeout(() => {
         setIsEditing(false);
         setMsg('');
         setOldPass('');
         setNewPass('');
      }, 1000);
   };

   return (
      <div className="space-y-8 pb-24 md:pb-10 max-w-4xl mx-auto">

         {/* Profile Header */}
         <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden group transition-colors">
            <div className="h-32 bg-gradient-emerald-dark relative">
               <div className="absolute right-0 top-0 p-8 opacity-10">
                  <IconShield className="w-48 h-48 text-white rotate-12 transform translate-x-12 -translate-y-12" />
               </div>
            </div>
            <div className="px-8 pb-8 flex flex-col md:flex-row items-start md:items-end -mt-12 gap-6 relative">
               <div className="w-24 h-24 rounded-[2rem] bg-white dark:bg-slate-900 p-1.5 shadow-lg">
                  <div className="w-full h-full bg-emerald-100 dark:bg-emerald-900/50 rounded-[1.5rem] flex items-center justify-center text-2xl font-bold text-emerald-800 dark:text-emerald-400 border-2 border-white dark:border-slate-800">
                     {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
               </div>

               <div className="flex-1 space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-gray-500 dark:text-slate-400 font-medium">{user.role} • Obras Industriais</p>
               </div>

               <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-sm"
               >
                  <IconEdit className="w-4 h-4" /> Editar Perfil
               </button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-100 dark:hover:border-emerald-900 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-gradient-emerald-soft dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <IconCheckCircle className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">42</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Inspeções Feitas</p>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-100 dark:hover:border-emerald-900 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <IconShield className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">15</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">APRs Aprovadas</p>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:border-emerald-100 dark:hover:border-emerald-900 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <IconAlertTriangle className="w-6 h-6" />
               </div>
               <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">3</p>
                  <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">Riscos Iminentes</p>
               </div>
            </div>
         </div>

         {/* Settings Section */}
         <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 p-8 space-y-8 transition-colors">
            <div>
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Configurações do Aplicativo</h3>
               <p className="text-sm text-gray-500 dark:text-slate-400">Gerencie suas preferências e notificações.</p>
            </div>

            <div className="space-y-6">
               {/* Notification Toggle */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-gray-500 dark:text-slate-400">
                        <IconBell className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Notificações Push</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500">Receber alertas de riscos e aprovações</p>
                     </div>
                  </div>
                  <button
                     onClick={() => setNotifications(!notifications)}
                     className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                  >
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${notifications ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>

               {/* Theme Toggle */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-gray-500 dark:text-slate-400">
                        <IconMoon className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">Modo Escuro</p>
                        <p className="text-xs text-gray-500 dark:text-slate-500">Ajustar aparência do aplicativo</p>
                     </div>
                  </div>
                  <button
                     onClick={() => setDarkMode(!darkMode)}
                     className={`w-14 h-8 rounded-full transition-colors relative ${darkMode ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                  >
                     <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${darkMode ? 'left-7' : 'left-1'}`} />
                  </button>
               </div>



               <div className="h-px bg-gray-100 dark:bg-slate-800 w-full my-4" />

               {/* Subscription Management */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-xl text-gray-500 dark:text-slate-400">
                        <IconCreditCard className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="flex items-center gap-2">
                           <p className="font-bold text-gray-800 dark:text-gray-200">Assinatura</p>
                           {(subscriptionStatus === 'active' || subscriptionStatus === 'trialing') && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-emerald-dark text-white shadow-sm uppercase">PRO</span>
                           )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-500">
                           {subscriptionStatus === 'active' || subscriptionStatus === 'trialing'
                              ? 'Gerenciar seu plano atual (Downgrade/Cancelamento)'
                              : 'Plano Gratuito (1 Obra). Faça upgrade para ilimitado.'}
                        </p>
                     </div>
                  </div>
                  <button
                     onClick={subscriptionStatus === 'active' || subscriptionStatus === 'trialing' ? redirectToPortal : redirectToCheckout}
                     className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${subscriptionStatus === 'active' || subscriptionStatus === 'trialing'
                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                        : 'bg-gradient-emerald-dark text-white hover:shadow-lg'
                        }`}
                  >
                     {subscriptionStatus === 'active' || subscriptionStatus === 'trialing' ? 'Gerenciar Assinatura' : 'Seja PRO'}
                  </button>
               </div>

               <div className="h-px bg-gray-100 dark:bg-slate-800 w-full my-4" />

               {/* Logout */}
               <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full group hover:bg-red-50 dark:hover:bg-red-900/10 p-2 rounded-xl transition-colors -ml-2"
               >
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                     <IconLogOut className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                     <p className="font-bold text-red-600 dark:text-red-400">Sair da Conta</p>
                     <p className="text-xs text-red-400 dark:text-red-500/80">Encerrar sessão atual com segurança</p>
                  </div>
               </button>
            </div>
         </div>

         {/* Edit Modal */}
         {
            isEditing && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                  <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl p-6 border border-gray-100 dark:border-slate-800">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Editar Perfil</h3>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                     </div>

                     <div className="space-y-4">
                        <div>
                           <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Nome Completo</label>
                           <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 mt-1 border border-transparent focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                              <IconUser className="w-5 h-5 text-gray-400" />
                              <input
                                 type="text"
                                 value={editName}
                                 onChange={(e) => setEditName(e.target.value)}
                                 className="bg-transparent w-full outline-none text-gray-800 dark:text-white font-medium"
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">E-mail</label>
                           <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 mt-1 opacity-60 cursor-not-allowed">
                              <div className="w-5 h-5 text-gray-400">@</div>
                              <input
                                 type="text"
                                 value={editEmail}
                                 disabled
                                 className="bg-transparent w-full outline-none text-gray-800 dark:text-white font-medium cursor-not-allowed"
                              />
                           </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                           <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Alterar Senha</label>
                           <div className="space-y-3 mt-2">
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-500">
                                 <IconLock className="w-5 h-5 text-gray-400" />
                                 <input
                                    type="password"
                                    placeholder="Senha Atual"
                                    value={oldPass}
                                    onChange={(e) => setOldPass(e.target.value)}
                                    className="bg-transparent w-full outline-none text-gray-800 dark:text-white"
                                 />
                              </div>
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 rounded-xl px-4 py-3 border border-transparent focus-within:border-emerald-500">
                                 <IconLock className="w-5 h-5 text-gray-400" />
                                 <input
                                    type="password"
                                    placeholder="Nova Senha"
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    className="bg-transparent w-full outline-none text-gray-800 dark:text-white"
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     {msg && (
                        <div className={`mt-4 text-center text-sm font-bold p-2 rounded-lg ${msg.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {msg}
                        </div>
                     )}

                     <div className="flex gap-3 mt-8">
                        <button
                           onClick={() => setIsEditing(false)}
                           className="flex-1 py-3 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl"
                        >
                           Cancelar
                        </button>
                        <button
                           onClick={handleSaveProfile}
                           className="flex-1 py-3 bg-gradient-emerald-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                           Salvar
                        </button>
                     </div>
                  </div>
               </div>
            )
         }

      </div >
   );
};

export default Profile;