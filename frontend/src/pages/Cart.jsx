import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2 } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16 px-4">
        <div className="text-center">
          <p className="text-3xl font-bold mb-4">Tu carrito está vacío</p>
          <p className="text-gray-400 mb-8">¡Agrega algunos productos increíbles!</p>
          <Link to="/products" className="btn-primary inline-block">
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Tu Carrito ({getCartCount()})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemId = item.id || item._id;
              return (
              <div key={`${itemId}-${item.size}-${item.color}`} className="card flex gap-4">
                <div className="w-24 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">📦</div>
                  )}
                </div>

                <div className="flex-grow">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {item.size && `Talla: ${item.size}`}
                    {item.size && item.color && ' • '}
                    {item.color && `Color: ${item.color}`}
                  </p>
                  <p className="font-bold">{formatPrice(item.price)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(itemId, item.size, item.color)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 size={20} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity - 1, item.size, item.color)}
                      className="w-8 h-8 bg-gray-800 rounded hover:bg-gray-700"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(itemId, item.quantity + 1, item.size, item.color)}
                      className="w-8 h-8 bg-gray-800 rounded hover:bg-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Resumen</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Envío</span>
                  <span className="font-bold">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IVA (19%)</span>
                  <span className="font-bold">{formatPrice(getCartTotal() * 0.19)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between text-xl">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">{formatPrice(getCartTotal() * 1.19)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block w-full btn-primary text-center">
                Proceder al Pago
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
