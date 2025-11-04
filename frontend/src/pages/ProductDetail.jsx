import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
      // NO seleccionar automáticamente - el cliente debe elegir
      setSelectedSize('');
      setSelectedColor('');
    } catch (error) {
      console.error('Error al cargar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // Validar que se haya seleccionado talla (si el producto tiene tallas)
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.warning('Por favor selecciona una talla antes de añadir al carrito');
      return;
    }

    // Validar que se haya seleccionado color (si el producto tiene colores)
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.warning('Por favor selecciona un color antes de añadir al carrito');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success('✓ Producto añadido al carrito');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-16">Cargando...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center pt-16">Producto no encontrado</div>;
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="aspect-square bg-gray-900 rounded-2xl overflow-hidden">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold mb-6">{formatPrice(product.price)}</p>
            <p className="text-gray-400 mb-8">{product.description}</p>

            {/* Tallas */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Talla <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'border-gray-700 hover:border-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-gray-400 mt-2">Selecciona una talla</p>
                )}
              </div>
            )}

            {/* Colores */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Color <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3 flex-wrap items-center">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex flex-col items-center gap-1 transition ${
                        selectedColor === color.name ? 'scale-110' : ''
                      }`}
                      title={color.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition ${
                          selectedColor === color.name ? 'border-white' : 'border-gray-700'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className={`text-xs ${selectedColor === color.name ? 'text-white font-bold' : 'text-gray-400'}`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
                {!selectedColor && (
                  <p className="text-xs text-gray-400 mt-2">Selecciona un color</p>
                )}
              </div>
            )}

            {/* Cantidad */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Cantidad</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">Stock disponible: {product.stock}</p>
            </div>

            <button 
              onClick={handleAddToCart} 
              className="w-full btn-primary"
              disabled={quantity < 1 || quantity > product.stock}
            >
              Agregar al Carrito
            </button>
            
            {/* Indicador de lo que se va a añadir */}
            {(selectedSize || selectedColor) && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg text-sm">
                <p className="font-medium mb-2">Configuración seleccionada:</p>
                <ul className="space-y-1 text-gray-400">
                  {selectedSize && <li>• Talla: <span className="text-white">{selectedSize}</span></li>}
                  {selectedColor && <li>• Color: <span className="text-white">{selectedColor}</span></li>}
                  <li>• Cantidad: <span className="text-white">{quantity}</span></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
