import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // Obtener la clave única del carrito según el usuario
  const getCartKey = () => {
    return user ? `cart_${user.id}` : 'cart_guest';
  };

  // Cargar carrito del localStorage cuando el usuario cambia
  useEffect(() => {
    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  }, [user]); // Se recarga cuando cambia el usuario

  // Guardar carrito en localStorage
  useEffect(() => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, user]);

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCart((prevCart) => {
      const productId = product.id || product._id;
      const existingItem = prevCart.find(
        (item) => 
          (item.id || item._id) === productId && 
          item.size === size && 
          item.color === color
      );

      if (existingItem) {
        toast.info('Cantidad actualizada en el carrito');
        return prevCart.map((item) =>
          (item.id || item._id) === productId && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success('Producto agregado al carrito');
        return [...prevCart, { ...product, quantity, size, color }];
      }
    });
  };

  const removeFromCart = (productId, size = null, color = null) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => 
          !((item.id || item._id) === productId && item.size === size && item.color === color)
      )
    );
    toast.info('Producto eliminado del carrito');
  };

  const updateQuantity = (productId, quantity, size = null, color = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id || item._id) === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Carrito vaciado');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
