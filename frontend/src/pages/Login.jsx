import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    // Validar contraseña no vacía
    if (!formData.password.trim()) {
      toast.error('Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);
    try {
      // Limpiar espacios en blanco del email y password
      const cleanFormData = {
        email: formData.email.trim(),
        password: formData.password.trim()
      };
      const userData = await login(cleanFormData);
      
      toast.success(`¡Bienvenido ${userData.name}!`);
      
      // Redirigir al admin panel si es administrador
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      // El error ya se muestra en el contexto AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">Iniciar Sesión</h2>
          <p className="text-gray-400">Bienvenido de vuelta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-white hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <p className="text-sm text-blue-300 mb-2">Cuentas de prueba:</p>
          <p className="text-xs text-gray-400">Admin: admin@elite.com / admin123</p>
          <p className="text-xs text-gray-400">User: user@elite.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
