import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, orderService, userService } from '../../services';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import { formatPrice } from '../../utils/formatPrice';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        productService.getProducts({ limit: 1 }),
        orderService.getAllOrders({ limit: 1 }),
        userService.getUsers({ limit: 1 })
      ]);

      setStats({
        totalProducts: products.total || 0,
        totalOrders: orders.total || 0,
        totalUsers: users.total || 0,
        totalRevenue: 0 // Calcular desde orders si es necesario
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Productos', value: stats.totalProducts, icon: FiPackage, color: 'from-blue-500 to-cyan-500', link: '/admin/products' },
    { title: 'Total Pedidos', value: stats.totalOrders, icon: FiShoppingBag, color: 'from-purple-500 to-pink-500', link: '/admin/orders' },
    { title: 'Total Usuarios', value: stats.totalUsers, icon: FiUsers, color: 'from-green-500 to-teal-500', link: '/admin/users' },
    { title: 'Gestión Financiera', value: formatPrice(stats.totalRevenue), icon: FiDollarSign, color: 'from-yellow-500 to-orange-500', link: '/admin/finance' }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-16">Cargando...</div>;
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Panel de Administración</h1>
          <Link to="/" className="btn-secondary">Volver a la Tienda</Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link} className="card group hover:scale-105">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/products" className="card text-center p-8 hover:scale-105">
            <FiPackage size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Gestionar Productos</h3>
            <p className="text-gray-400">Crear, editar y eliminar productos</p>
          </Link>

          <Link to="/admin/orders" className="card text-center p-8 hover:scale-105">
            <FiShoppingBag size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Gestionar Pedidos</h3>
            <p className="text-gray-400">Ver y actualizar estados de pedidos</p>
          </Link>

          <Link to="/admin/users" className="card text-center p-8 hover:scale-105">
            <FiUsers size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Gestionar Usuarios</h3>
            <p className="text-gray-400">Administrar usuarios y permisos</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
