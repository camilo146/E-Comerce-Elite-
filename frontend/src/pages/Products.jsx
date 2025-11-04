import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../services';
import { formatPrice } from '../utils/formatPrice';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const search = searchParams.get('search');

  useEffect(() => {
    fetchProducts();
  }, [category, subcategory, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;
      if (search) params.search = search;
      
      const data = await productService.getProducts(params);
      setProducts(data.products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (search) return `Resultados para "${search}"`;
    if (category && subcategory) {
      const categoryName = category === 'mujer' ? 'Mujer' : category === 'hombre' ? 'Hombre' : 'Unisex';
      const subcategoryName = subcategory.charAt(0).toUpperCase() + subcategory.slice(1);
      return `${categoryName} - ${subcategoryName}`;
    }
    if (category) {
      return category === 'mujer' ? 'Mujer' : category === 'hombre' ? 'Hombre' : 'Unisex';
    }
    return 'Todos los Productos';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-2xl">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 capitalize">
          {getTitle()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id || product._id} className="card group">
              <Link to={`/product/${product.id || product._id}`}>
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-400">{formatPrice(product.price)}</span>
                    {product.onSale && product.salePrice && (
                      <span className="text-sm bg-red-500 px-2 py-1 rounded font-bold">
                        -{Math.round(((parseFloat(product.salePrice) - parseFloat(product.price)) / parseFloat(product.salePrice)) * 100)}%
                      </span>
                    )}
                  </div>
                  {product.onSale && product.salePrice && (
                    <span className="text-sm text-gray-500 line-through">{formatPrice(product.salePrice)}</span>
                  )}
                </div>
                
                {/* Colores disponibles */}
                {product.colors && product.colors.length > 0 && (
                  <div className="flex gap-1 mb-2">
                    {product.colors.slice(0, 5).map((color, idx) => (
                      <div
                        key={idx}
                        className="w-4 h-4 rounded-full border border-gray-600"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                    {product.colors.length > 5 && (
                      <span className="text-xs text-gray-400 ml-1">+{product.colors.length - 5}</span>
                    )}
                  </div>
                )}
              </Link>
              <Link 
                to={`/product/${product.id || product._id}`}
                className="block w-full btn-primary mt-4 text-center"
              >
                Ver Detalles
              </Link>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
