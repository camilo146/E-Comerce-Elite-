import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, uploadService } from '../services';
import { FiCamera, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profileImage: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadService.uploadImage(file, true); // true = perfil
      const imageUrl = `http://localhost:5000${response.imageUrl}`;
      
      setFormData(prev => ({ ...prev, profileImage: imageUrl }));
      toast.success('Foto subida correctamente');
    } catch (error) {
      toast.error('Error al subir la foto');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar nombre
    if (formData.name && formData.name.length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validar email
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Por favor ingresa un email válido');
        return;
      }
    }

    // Validar teléfono si se proporciona
    if (formData.phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        toast.error('El teléfono debe tener 10 dígitos');
        return;
      }
    }

    try {
      const response = await authService.updateProfile(formData);
      
      // Actualizar el contexto de auth con los nuevos datos
      const updatedUser = { ...user, ...response.data };
      login(updatedUser, localStorage.getItem('token'));
      
      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">Debes iniciar sesión para ver tu perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mi Perfil</h1>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <FiEdit2 /> Editar Perfil
            </button>
          ) : (
            <button 
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  address: user.address || '',
                  city: user.city || '',
                  country: user.country || '',
                  profileImage: user.profileImage || ''
                });
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <FiX /> Cancelar
            </button>
          )}
        </div>

        <div className="card">
          {/* Foto de perfil */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">👤</span>
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
                  <FiCamera className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">Subiendo...</span>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="+57 300 123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ciudad</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Bogotá"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">País</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="input-field"
                  placeholder="Colombia"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dirección</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="input-field"
                rows="3"
                placeholder="Calle 123 #45-67, Apartamento 101"
              />
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FiSave /> Guardar Cambios
                </button>
              </div>
            )}
          </form>

          {/* Información adicional */}
          {!isEditing && (
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-bold mb-4">Información de la Cuenta</h3>
              <div className="space-y-2 text-gray-400">
                <p>Tipo de cuenta: <span className="text-white">{user.role === 'admin' ? 'Administrador' : 'Cliente'}</span></p>
                <p>Miembro desde: <span className="text-white">{new Date(user.createdAt).toLocaleDateString('es-CO')}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
