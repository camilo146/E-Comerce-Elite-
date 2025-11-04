import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services';
import { formatPrice } from '../utils/formatPrice';
import { FiPackage, FiTruck, FiCheck, FiClock, FiX } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': {
        label: 'Pendiente',
        icon: FiClock,
        color: 'text-yellow-400 bg-yellow-500/20'
      },
      'processing': {
        label: 'Procesando',
        icon: FiPackage,
        color: 'text-blue-400 bg-blue-500/20'
      },
      'shipped': {
        label: 'Enviado',
        icon: FiTruck,
        color: 'text-purple-400 bg-purple-500/20'
      },
      'delivered': {
        label: 'Entregado',
        icon: FiCheck,
        color: 'text-green-400 bg-green-500/20'
      },
      'cancelled': {
        label: 'Cancelado',
        icon: FiX,
        color: 'text-red-400 bg-red-500/20'
      }
    };
    return statusMap[status] || statusMap['pending'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-2xl">Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Mis Pedidos</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-2xl font-bold mb-2">No tienes pedidos aún</p>
            <p className="text-gray-400 mb-8">¡Empieza a comprar ahora!</p>
            <Link to="/products" className="btn-primary inline-block">
              Ver Productos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderIdDisplay = order.id || order._id;
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={orderIdDisplay} className="card">
                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-700">
                    <div>
                      <p className="text-xl font-bold mb-1">
                        Pedido #{String(orderIdDisplay).slice(-8)}
                      </p>
                      <p className="text-sm text-gray-400">
                        Realizado el {new Date(order.createdAt).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.color}`}>
                        <StatusIcon size={18} />
                        <span className="font-medium">{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estado del pedido - Timeline */}
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <h3 className="font-bold mb-4 text-sm text-gray-400">Estado del Pedido</h3>
                    <div className="flex justify-between items-center">
                      {['pending', 'processing', 'shipped', 'delivered'].map((statusKey, index, array) => {
                        const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
                        const currentIndex = statusOrder.indexOf(order.status);
                        const thisIndex = statusOrder.indexOf(statusKey);
                        const isCompleted = thisIndex <= currentIndex && order.status !== 'cancelled';
                        const isCancelled = order.status === 'cancelled';
                        const info = getStatusInfo(statusKey);
                        const Icon = info.icon;

                        return (
                          <div key={statusKey} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                                isCompleted ? 'bg-green-500 text-white' : 
                                isCancelled ? 'bg-gray-700 text-gray-500' :
                                'bg-gray-800 text-gray-500'
                              }`}>
                                <Icon size={20} />
                              </div>
                              <span className={`text-xs mt-2 ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                {info.label}
                              </span>
                            </div>
                            {index < array.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-2 ${
                                isCompleted ? 'bg-green-500' : 'bg-gray-700'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {order.status === 'cancelled' && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                        Este pedido fue cancelado
                      </div>
                    )}
                  </div>

                  {/* Productos */}
                  <div className="mb-6">
                    <h3 className="font-bold mb-4 text-sm text-gray-400">Productos</h3>
                    <div className="space-y-3">
                      {order.orderItems && order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-gray-800/30 rounded">
                          <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">📦</div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium">{item.name || 'Producto'}</h4>
                            <p className="text-sm text-gray-400">
                              {item.size && `Talla: ${item.size}`}
                              {item.size && item.color && ' • '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                            <p className="text-sm text-gray-400">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dirección de envío */}
                  {order.shippingAddress && (
                    <div className="mb-6 p-4 bg-gray-800/30 rounded">
                      <h3 className="font-bold mb-2 text-sm text-gray-400">Dirección de Envío</h3>
                      <p className="text-sm">
                        {order.shippingAddress.fullName || order.shippingAddress.street}<br />
                        {order.shippingAddress.address || order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}

                  {/* Resumen de pago */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.itemsPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>IVA (19%)</span>
                      <span>{formatPrice(order.taxPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Envío</span>
                      <span className="text-green-400">Gratis</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                  </div>

                  {/* Información de pago */}
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className={`px-3 py-1 rounded ${
                      order.isPaid 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.isPaid ? '✓ Pagado' : 'Pendiente de pago'}
                    </span>
                    {order.isPaid && order.paidAt && (
                      <span className="text-gray-400">
                        el {new Date(order.paidAt).toLocaleDateString('es-CO')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
