import { User } from '../types';

const AUTH_KEY = 'safeguard_auth';

export const login = (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock validation
      if (email === 'tst@safeguard.com' && password === '123456') {
        const user: User = { name: 'Carlos Silva', role: 'TST' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        resolve({ success: true, user });
      } else if (email === 'eng@safeguard.com' && password === '123456') {
        const user: User = { name: 'Eng. Roberto', role: 'Engenheiro' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        resolve({ success: true, user });
      } else {
        resolve({ success: false, message: 'Credenciais inválidas' });
      }
    }, 1000);
  });
};

export const register = (name: string, email: string, role: string): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock registration
      resolve({ success: true, message: 'Usuário registrado com sucesso!' });
    }, 1000);
  });
};

export const recoverPassword = (email: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: `Um link de redefinição foi enviado para ${email}` });
    }, 800);
  });
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(AUTH_KEY);
};

export const updateProfile = (data: Partial<User>): Promise<boolean> => {
  return new Promise((resolve) => {
    const current = getCurrentUser();
    if (current) {
      const updated = { ...current, ...data };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

export const changePassword = (oldPass: string, newPass: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        // Mock check
        if(oldPass === '123456') {
            resolve({ success: true, message: 'Senha alterada com sucesso!' });
        } else {
            resolve({ success: false, message: 'Senha atual incorreta.' });
        }
    }, 800);
  });
};