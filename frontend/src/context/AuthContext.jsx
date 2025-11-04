import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials, token = null) => {
    try {
      // Si se pasa userData y token directamente (para actualización de perfil)
      if (token && typeof credentials === 'object' && !credentials.email) {
        setUser(credentials);
        localStorage.setItem('user', JSON.stringify(credentials));
        return credentials;
      }
      
      // Login normal
      const data = await authService.login(credentials);
      setUser(data);
      toast.success('¡Bienvenido!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data);
      toast.success('¡Registro exitoso!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.info('Sesión cerrada');
  };

  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);
      setUser(data);
      toast.success('Perfil actualizado');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar perfil');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
