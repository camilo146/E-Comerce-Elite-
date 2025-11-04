import { useState, useEffect } from 'react';
import { productService, uploadService } from '../../services';
import { FiEdit, FiTrash2, FiPlus, FiX, FiUpload, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { formatPrice } from '../../utils/formatPrice';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    salePrice: '', // Precio sin descuento (para mostrar tachado)
    category: 'mujer',
    subcategory: '',
    images: [],
    sizes: [],
    colors: [],
    stock: 0,
    inStock: true,
    featured: false,
    onSale: false,
    brand: '',
    tags: []
  });
  const [imageUrls, setImageUrls] = useState(['']);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [availableSizes, setAvailableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  
  // Tallas de zapatos (sistema numérico)
  const shoesSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  
  // Tallas de ropa (sistema de letras)
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const [availableColors, setAvailableColors] = useState([
    { name: 'Negro', hex: '#000000' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Gris', hex: '#808080' },
    { name: 'Azul', hex: '#0000FF' },
    { name: 'Rojo', hex: '#FF0000' },
    { name: 'Verde', hex: '#00FF00' },
    { name: 'Amarillo', hex: '#FFFF00' },
    { name: 'Rosa', hex: '#FFC0CB' },
    { name: 'Naranja', hex: '#FFA500' },
    { name: 'Morado', hex: '#800080' },
    { name: 'Azul Marino', hex: '#000080' },
    { name: 'Beige', hex: '#F5F5DC' }
  ]);
  const [newTag, setNewTag] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [originalPriceBeforeDiscount, setOriginalPriceBeforeDiscount] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cambiar tallas según la subcategoría
  useEffect(() => {
    if (formData.subcategory === 'zapatos') {
      setAvailableSizes(shoesSizes);
    } else {
      setAvailableSizes(clothingSizes);
    }
    // Limpiar tallas seleccionadas al cambiar de subcategoría
    setFormData(prev => ({ ...prev, sizes: [] }));
  }, [formData.subcategory]);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts({ limit: 100 });
      setProducts(data.products);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        salePrice: product.salePrice || '',
        category: product.category || 'mujer',
        subcategory: product.subcategory || '',
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock || 0,
        inStock: product.inStock !== false,
        featured: product.featured || false,
        onSale: product.onSale || false,
        brand: product.brand || '',
        tags: product.tags || []
      });
      setImageUrls(product.images?.length > 0 ? product.images : ['']);
      
      // Si está en oferta, calcular el descuento
      if (product.onSale && product.salePrice) {
        const salePriceValue = parseFloat(product.salePrice);
        const currentPrice = parseFloat(product.price);
        const discount = ((salePriceValue - currentPrice) / salePriceValue) * 100;
        setDiscountPercentage(Math.round(discount));
        setOriginalPriceBeforeDiscount(product.salePrice);
      } else {
        setDiscountPercentage(0);
        setOriginalPriceBeforeDiscount('');
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        salePrice: '',
        category: 'mujer',
        subcategory: '',
        images: [],
        sizes: [],
        colors: [],
        stock: 0,
        inStock: true,
        featured: false,
        onSale: false,
        brand: '',
        tags: []
      });
      setImageUrls(['']);
      
      // Resetear descuento
      setDiscountPercentage(0);
      setOriginalPriceBeforeDiscount('');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewTag('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Si se activa "En Oferta", guardar el precio de venta como salePrice y aplicar descuento al price
    if (name === 'onSale' && checked && formData.price) {
      const currentPrice = parseFloat(formData.price);
      setOriginalPriceBeforeDiscount(currentPrice.toString());
      setDiscountPercentage(20); // Descuento por defecto 20%
      
      // Calcular precio con descuento
      const discountedPrice = currentPrice * 0.8; // 20% de descuento
      
      setFormData(prev => ({
        ...prev,
        onSale: true,
        salePrice: currentPrice.toString(), // Guardar precio sin descuento
        price: discountedPrice.toFixed(2) // Aplicar descuento al precio
      }));
      return;
    }
    
    // Si se desactiva "En Oferta", restaurar precio original y limpiar salePrice
    if (name === 'onSale' && !checked) {
      if (originalPriceBeforeDiscount) {
        setFormData(prev => ({ 
          ...prev, 
          price: originalPriceBeforeDiscount,
          salePrice: '', // Limpiar precio de oferta
          onSale: false
        }));
      }
      setDiscountPercentage(0);
      setOriginalPriceBeforeDiscount('');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDiscountChange = (percentage) => {
    setDiscountPercentage(percentage);
    
    // Calcular nuevo precio con descuento basado en el precio sin descuento guardado
    if (originalPriceBeforeDiscount) {
      const salePriceValue = parseFloat(originalPriceBeforeDiscount);
      const discountAmount = salePriceValue * (percentage / 100);
      const newPrice = salePriceValue - discountAmount;
      
      setFormData(prev => ({
        ...prev,
        salePrice: originalPriceBeforeDiscount, // Precio sin descuento (para mostrar tachado)
        price: newPrice.toFixed(2) // Precio con descuento aplicado
      }));
    }
  };

  const handleImageUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  const addImageUrl = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFormData(prev => ({
      ...prev,
      images: newUrls.filter(url => url.trim() !== '')
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    setUploadingImages(true);
    
    try {
      const uploadPromises = files.map(file => uploadService.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      
      // Agregar las URLs de las imágenes subidas
      const uploadedUrls = results.map(result => `http://localhost:5000${result.imageUrl}`);
      const newUrls = [...imageUrls.filter(url => url.trim() !== ''), ...uploadedUrls];
      
      setImageUrls(newUrls);
      setFormData(prev => ({
        ...prev,
        images: newUrls
      }));
      
      toast.success(`${files.length} imagen(es) subida(s) exitosamente`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al subir las imágenes');
    } finally {
      setUploadingImages(false);
      // Limpiar el input
      e.target.value = '';
    }
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const toggleColor = (colorObj) => {
    setFormData(prev => {
      const colorExists = prev.colors.some(c => c.name === colorObj.name);
      return {
        ...prev,
        colors: colorExists
          ? prev.colors.filter(c => c.name !== colorObj.name)
          : [...prev.colors, colorObj]
      };
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de campos obligatorios
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validación de nombre
    if (formData.name.length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return;
    }

    // Validación de descripción
    if (formData.description.length < 10) {
      toast.error('La descripción debe tener al menos 10 caracteres');
      return;
    }

    // Validación de precio de venta
    if (parseFloat(formData.price) <= 0) {
      toast.error('El precio de venta debe ser mayor a 0');
      return;
    }

    // Validación de precio original (costo)
    if (formData.originalPrice && parseFloat(formData.originalPrice) <= 0) {
      toast.error('El precio original (costo) debe ser mayor a 0');
      return;
    }

    // Validación: precio de venta debe ser mayor al costo para tener ganancia
    if (formData.originalPrice && parseFloat(formData.price) <= parseFloat(formData.originalPrice)) {
      toast.error('El precio de venta debe ser mayor al costo para generar ganancia. Costo: ' + formatPrice(formData.originalPrice) + ' - Venta: ' + formatPrice(formData.price));
      return;
    }

    // Validación de stock
    if (parseInt(formData.stock) < 0) {
      toast.error('El stock no puede ser negativo');
      return;
    }

    // Validación de imágenes
    if (formData.images.length === 0) {
      toast.error('Agrega al menos una imagen');
      return;
    }

    // Validación de tallas y colores
    if (formData.sizes.length === 0) {
      toast.warning('Recomendamos agregar al menos una talla');
    }

    if (formData.colors.length === 0) {
      toast.warning('Recomendamos agregar al menos un color');
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock) || 0
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productService.createProduct(productData);
        toast.success('Producto creado exitosamente');
      }
      
      closeModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.');
    if (!confirmDelete) return;
    
    try {
      await productService.deleteProduct(id);
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar el producto');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16">Cargando...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gestión de Productos</h1>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <FiPlus /> Nuevo Producto
          </button>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4">Imagen</th>
                <th className="text-left p-4">Nombre</th>
                <th className="text-left p-4">Precio</th>
                <th className="text-left p-4">Categoría</th>
                <th className="text-left p-4">Stock</th>
                <th className="text-left p-4">Estado</th>
                <th className="text-right p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : '📦'}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-green-400">{formatPrice(product.price)}</span>
                      {product.onSale && product.salePrice && (
                        <span className="text-sm text-gray-500 line-through">{formatPrice(product.salePrice)}</span>
                      )}
                      {!product.onSale && product.originalPrice && (
                        <span className="text-xs text-gray-600">Costo: {formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 capitalize">{product.category}</td>
                  <td className="p-4">
                    <span className={product.stock > 0 ? 'text-green-400' : 'text-red-400'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.featured && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded mr-1">★</span>}
                    {product.onSale && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">SALE</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(product)} className="p-2 hover:bg-gray-700 rounded">
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-900/50 rounded text-red-400">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para crear/editar producto */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Nombre del Producto *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Descripción *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Precio *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Precio Original (opcional)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Categoría *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="mujer">Mujer</option>
                      <option value="hombre">Hombre</option>
                      <option value="mixta">Mixta (Unisex)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subcategoría *</label>
                    <select
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Selecciona una subcategoría</option>
                      <option value="camisas">Camisas</option>
                      <option value="pantalones">Pantalones</option>
                      <option value="zapatos">Zapatos</option>
                      <option value="accesorios">Accesorios</option>
                      <option value="gorras">Gorras</option>
                      <option value="medias">Medias</option>
                      <option value="descuentos">Descuentos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Marca</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Imágenes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Imágenes del Producto *
                  </label>
                  
                  {/* Botón para subir archivos */}
                  <div className="mb-4">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg border-2 border-dashed border-blue-500/50 hover:bg-blue-500/30 cursor-pointer transition">
                      <FiImage size={20} />
                      <span>{uploadingImages ? 'Subiendo...' : 'Subir Imágenes desde el Ordenador'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploadingImages}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">
                      Formatos: JPG, PNG, GIF, WEBP (máximo 5MB por imagen)
                    </p>
                  </div>

                  {/* Vista previa de imágenes */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== index);
                              setFormData(prev => ({ ...prev, images: newImages }));
                              setImageUrls(newImages.length > 0 ? newImages : ['']);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URLs manuales */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">O pega URLs de imágenes:</p>
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleImageUrlChange(index, e.target.value)}
                          placeholder="https://ejemplo.com/imagen.jpg"
                          className="input-field flex-1"
                        />
                        {imageUrls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageUrl(index)}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="btn-secondary w-full"
                    >
                      + Agregar URL
                    </button>
                  </div>
                </div>

                {/* Tallas */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tallas Disponibles</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded transition ${
                          formData.sizes.includes(size)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colores */}
                <div>
                  <label className="block text-sm font-medium mb-2">Colores Disponibles</label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map(colorObj => {
                      const isSelected = formData.colors.some(c => c.name === colorObj.name);
                      return (
                        <button
                          key={colorObj.name}
                          type="button"
                          onClick={() => toggleColor(colorObj)}
                          className={`flex items-center gap-2 px-4 py-2 rounded transition border-2 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full border border-gray-600"
                            style={{ backgroundColor: colorObj.hex }}
                          />
                          <span>{colorObj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Etiquetas (Tags)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="input-field flex-1"
                      placeholder="Agregar etiqueta..."
                    />
                    <button type="button" onClick={addTag} className="btn-secondary">
                      Agregar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-400">
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Opciones */}
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span>En Stock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span>Producto Destacado</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="onSale"
                      checked={formData.onSale}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span>En Oferta</span>
                  </label>
                </div>

                {/* Selector de Descuento */}
                {formData.onSale && (
                  <div className="card bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <span>🔥</span> Configuración de Descuento
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Porcentaje de Descuento: <span className="text-red-400 text-xl font-bold">{discountPercentage}%</span>
                        </label>
                        <input
                          type="range"
                          min="20"
                          max="90"
                          step="5"
                          value={discountPercentage}
                          onChange={(e) => handleDiscountChange(parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>20%</span>
                          <span>35%</span>
                          <span>50%</span>
                          <span>65%</span>
                          <span>80%</span>
                          <span>90%</span>
                        </div>
                      </div>

                      {originalPriceBeforeDiscount && (
                        <div className="bg-gray-800/50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Precio Original:</span>
                            <span className="text-lg font-semibold line-through text-gray-500">
                              {formatPrice(originalPriceBeforeDiscount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Descuento ({discountPercentage}%):</span>
                            <span className="text-red-400 font-semibold">
                              -{formatPrice(parseFloat(originalPriceBeforeDiscount) * (discountPercentage / 100))}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                            <span className="text-white font-bold">Precio Final:</span>
                            <span className="text-2xl font-bold text-green-400">
                              {formatPrice(formData.price)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        {[20, 30, 40, 50, 60, 70, 80, 90].map(percent => (
                          <button
                            key={percent}
                            type="button"
                            onClick={() => handleDiscountChange(percent)}
                            className={`px-4 py-2 rounded transition ${
                              discountPercentage === percent
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            {percent}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                  </button>
                  <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
