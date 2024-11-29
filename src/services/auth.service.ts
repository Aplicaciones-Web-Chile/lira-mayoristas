// Tipos para la autenticación
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone: string;
}

// Mock data for testing
const MOCK_USERS: User[] = [
  {
    id: 1,
    email: 'juan@aplicacionesweb.cl',
    name: 'Juan Jorquera',
    role: 'admin',
    phone: '+56 9 1234 5678',
  },
  {
    id: 2,
    email: 'vendedor@lira.cl',
    name: 'Vendedor Demo',
    role: 'seller',
    phone: '+56 9 8765 4321',
  }
];

import { ref } from 'vue';

const currentUser = ref<User | null>(null);

export const authService = {
  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || password !== '123456') {
      throw new Error('Credenciales inválidas');
    }
    
    currentUser.value = user;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    currentUser.value = null;
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<User | null> {
    if (currentUser.value) return currentUser.value;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      currentUser.value = JSON.parse(storedUser);
      return currentUser.value;
    }
    
    return null;
  },

  async isAuthenticated(): Promise<boolean> {
    return await this.getCurrentUser() !== null;
  }
};
