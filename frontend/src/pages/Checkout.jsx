import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services';
import { formatPrice } from '../utils/formatPrice';
import { toast } from 'react-toastify';
import { FiCreditCard, FiTruck, FiShoppingBag } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Dirección, 2: Pago, 3: Confirmación

  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Colombia'
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }

    // Pre-llenar con datos del usuario si existen
    if (user) {
      setShippingData(prev => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || 'Colombia'
      }));
    }
  }, [cart, navigate, user]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear número de tarjeta
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Formatear fecha de expiración
    if (name === 'expiryDate') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
      }
      setPaymentData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    const { fullName, phone, address, city, zipCode } = shippingData;
    
    // Validar campos obligatorios
    if (!fullName || !phone || !address || !city) {
      toast.error('Por favor completa todos los campos de envío');
      return false;
    }

    // Validar nombre completo
    if (fullName.length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return false;
    }

    // Validar teléfono (10 dígitos)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      toast.error('El teléfono debe tener 10 dígitos');
      return false;
    }

    // Validar dirección
    if (address.length < 10) {
      toast.error('La dirección debe ser más específica (mínimo 10 caracteres)');
      return false;
    }

    // Validar código postal (si se proporciona)
    if (zipCode && zipCode.length < 4) {
      toast.error('Código postal inválido');
      return false;
    }

    return true;
  };

  const validatePayment = () => {
    const { cardNumber, cardName, expiryDate, cvv } = paymentData;
    
    if (paymentData.paymentMethod === 'credit_card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error('Por favor completa todos los datos de pago');
        return false;
      }
      
      // Validar longitud de tarjeta
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (cleanCardNumber.length < 15 || cleanCardNumber.length > 16) {
        toast.error('Número de tarjeta inválido (debe tener 15-16 dígitos)');
        return false;
      }

      // Validar solo números
      if (!/^\d+$/.test(cleanCardNumber)) {
        toast.error('El número de tarjeta solo debe contener dígitos');
        return false;
      }
      
      // Validar nombre en tarjeta
      if (cardName.length < 3) {
        toast.error('El nombre en la tarjeta debe tener al menos 3 caracteres');
        return false;
      }

      // Validar formato de fecha (MM/YY)
      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        toast.error('Formato de fecha inválido (use MM/AA)');
        return false;
      }

      // Validar que la tarjeta no esté vencida
      const [month, year] = expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // últimos 2 dígitos
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        toast.error('La tarjeta está vencida');
        return false;
      }

      // Validar mes válido (01-12)
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        toast.error('Mes inválido (debe ser entre 01 y 12)');
        return false;
      }
      
      // Validar CVV
      if (cvv.length < 3 || cvv.length > 4) {
        toast.error('CVV inválido (debe tener 3 o 4 dígitos)');
        return false;
      }

      // Validar CVV solo números
      if (!/^\d+$/.test(cvv)) {
        toast.error('El CVV solo debe contener dígitos');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validatePayment()) return;

    setLoading(true);
    try {
      // Preparar items del pedido
      const orderItems = cart.map(item => ({
        product: item.id || item._id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      }));

      const subtotal = getCartTotal();
      const iva = subtotal * 0.19;
      const total = subtotal + iva;

      // Crear el pedido
      const orderData = {
        orderItems: orderItems,
        shippingAddress: shippingData,
        paymentMethod: paymentData.paymentMethod,
        itemsPrice: subtotal,
        taxPrice: iva,
        shippingPrice: 0,
        totalPrice: total
      };

      const response = await orderService.createOrder(orderData);
      
      toast.success('¡Pedido realizado con éxito!');
      clearCart();
      
      // Redirigir a la página de pedidos
      setTimeout(() => {
        navigate('/orders');
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Finalizar Compra</h1>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <FiTruck />
              </div>
              <span className="ml-2">Envío</span>
            </div>
            
            <div className={`h-0.5 w-16 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`} />
            
            <div className={`flex items-center ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <FiCreditCard />
              </div>
              <span className="ml-2">Pago</span>
            </div>
            
            <div className={`h-0.5 w-16 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`} />
            
            <div className={`flex items-center ${step >= 3 ? 'text-white' : 'text-gray-500'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <FiShoppingBag />
              </div>
              <span className="ml-2">Confirmación</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Paso 1: Dirección de Envío */}
            {step === 1 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Dirección de Envío</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingData.fullName}
                        onChange={handleShippingChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        className="input-field"
                        placeholder="+57 300 123 4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dirección *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className="input-field"
                      placeholder="Calle 123 #45-67, Apartamento 101"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ciudad *</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Departamento</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Código Postal</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">País</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingData.country}
                      onChange={handleShippingChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      if (validateShipping()) setStep(2);
                    }}
                    className="btn-primary"
                  >
                    Continuar al Pago
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Método de Pago */}
            {step === 2 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Método de Pago</h2>
                
                {/* Opciones de pago */}
                <div className="space-y-4 mb-6">
                  <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentData.paymentMethod === 'credit_card'}
                      onChange={handlePaymentChange}
                      className="mr-3"
                    />
                    <FiCreditCard className="mr-2" />
                    <span>Tarjeta de Crédito/Débito</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pse"
                      checked={paymentData.paymentMethod === 'pse'}
                      onChange={handlePaymentChange}
                      className="mr-3"
                    />
                    <span>PSE (Pago Seguro en Línea)</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentData.paymentMethod === 'cash_on_delivery'}
                      onChange={handlePaymentChange}
                      className="mr-3"
                    />
                    <span>Pago Contra Entrega</span>
                  </label>
                </div>

                {/* Formulario de tarjeta */}
                {paymentData.paymentMethod === 'credit_card' && (
                  <div className="space-y-4 border-t border-gray-700 pt-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Número de Tarjeta *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre en la Tarjeta *</label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        className="input-field"
                        placeholder="JUAN PÉREZ"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Fecha de Expiración *</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentData.expiryDate}
                          onChange={handlePaymentChange}
                          className="input-field"
                          placeholder="MM/AA"
                          maxLength="5"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          className="input-field"
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => {
                      if (validatePayment()) setStep(3);
                    }}
                    className="btn-primary"
                  >
                    Revisar Pedido
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Confirmación */}
            {step === 3 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-6">Confirmar Pedido</h2>

                {/* Resumen de envío */}
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="font-bold mb-2">Dirección de Envío</h3>
                  <p className="text-gray-400 text-sm">
                    {shippingData.fullName}<br />
                    {shippingData.address}<br />
                    {shippingData.city}, {shippingData.state} {shippingData.zipCode}<br />
                    {shippingData.country}<br />
                    Tel: {shippingData.phone}
                  </p>
                </div>

                {/* Resumen de pago */}
                <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                  <h3 className="font-bold mb-2">Método de Pago</h3>
                  <p className="text-gray-400 text-sm">
                    {paymentData.paymentMethod === 'credit_card' && `Tarjeta terminada en ${paymentData.cardNumber.slice(-4)}`}
                    {paymentData.paymentMethod === 'pse' && 'PSE - Pago Seguro en Línea'}
                    {paymentData.paymentMethod === 'cash_on_delivery' && 'Pago Contra Entrega'}
                  </p>
                </div>

                {/* Productos */}
                <div className="space-y-3">
                  <h3 className="font-bold">Productos</h3>
                  {cart.map((item) => {
                    const itemId = item.id || item._id;
                    return (
                      <div key={`${itemId}-${item.size}-${item.color}`} className="flex gap-4 p-3 bg-gray-800/30 rounded">
                        <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">📦</div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-400">
                            {item.size && `Talla: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="text-sm">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Volver
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Procesando...' : 'Confirmar y Pagar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Envío</span>
                  <span className="text-green-400">Gratis</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>IVA (19%)</span>
                  <span>{formatPrice(iva)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-300">
                <p className="font-medium mb-1">🔒 Pago Seguro</p>
                <p className="text-xs text-gray-400">
                  Tu información está protegida con encriptación SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
