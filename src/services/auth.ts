import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true };
      }
      
      return { success: false, error: 'Aucun token reçu' };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Échec de la connexion' 
      };
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  },

  isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
};

export default authService;
