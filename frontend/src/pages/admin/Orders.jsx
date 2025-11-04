import { useState, useEffect } from 'react';
import { orderService } from '../../services';
import { toast } from 'react-toastify';
import { formatPrice } from '../../utils/formatPrice';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getAllOrders({ limit: 100 });
      setOrders(data.orders);
    } catch (error) {
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Estado actualizado');
      fetchOrders();
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16">Cargando...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Gestión de Pedidos</h1>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay pedidos registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
            <div key={order.id || order._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold">Pedido #{String(order.id || order._id).padStart(8, '0')}</p>
                  <p className="text-sm text-gray-400">Cliente: {order.user?.name || order.User?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id || order._id, e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <p className="font-bold">Total: {formatPrice(order.totalPrice)}</p>
                <p className="text-sm text-gray-400">{order.orderItems?.length || 0} productos</p>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
