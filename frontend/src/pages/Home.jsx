import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-in-sportswear-walking-through-the-city-42416-large.mp4" type="video/mp4" />
          </video>
          {/* Overlay oscuro para mejorar legibilidad */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 px-4 animate-fadeIn">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl">
            Nueva Colección
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg">
            Descubre el futuro de la moda
          </p>
          <Link to="/products" className="btn-primary inline-block shadow-2xl">
            Comprar ahora
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Explora por Categoría
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mujer */}
          <Link to="/products?category=mujer" className="group relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop" 
              alt="Moda Mujer"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold mb-2">Mujer</h3>
              <p className="text-gray-300">Las últimas tendencias</p>
            </div>
          </Link>

          {/* Hombre */}
          <Link to="/products?category=hombre" className="group relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=600&fit=crop" 
              alt="Moda Hombre"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold mb-2">Hombre</h3>
              <p className="text-gray-300">Estilo moderno</p>
            </div>
          </Link>

          {/* Unisex */}
          <Link to="/products?category=mixta" className="group relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&h=600&fit=crop" 
              alt="Moda Unisex"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold mb-2">Unisex</h3>
              <p className="text-gray-300">Para todos</p>
            </div>
          </Link>

          {/* Zapatos - Nike Air Force One */}
          <Link to="/products?category=mujer&subcategory=zapatos" className="group relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop" 
              alt="Nike Air Force One"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-bold mb-2">Zapatos</h3>
              <p className="text-gray-300">Nike Air Force & más</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Subcategorías Populares */}
      <section className="max-w-7xl mx-auto px-4 py-20 bg-gray-900/50">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Categorías Populares
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Camisas */}
          <Link to="/products?subcategory=camisas" className="group relative h-64 rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop" 
              alt="Camisas"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold">Camisas</h3>
            </div>
          </Link>

          {/* Pantalones */}
          <Link to="/products?subcategory=pantalones" className="group relative h-64 rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=600&fit=crop" 
              alt="Pantalones"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold">Pantalones</h3>
            </div>
          </Link>

          {/* Accesorios - Reloj */}
          <Link to="/products?subcategory=accesorios" className="group relative h-64 rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop" 
              alt="Relojes y Accesorios"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold">Accesorios</h3>
            </div>
          </Link>

          {/* Gorras - Goorin Bros style */}
          <Link to="/products?subcategory=gorras" className="group relative h-64 rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=400&h=400&fit=crop" 
              alt="Gorras Goorin Bros"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold">Gorras</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop" 
            alt="Sale Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative z-10 p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Sale - Hasta 50% OFF
            </h2>
            <p className="text-xl mb-8 drop-shadow-md">No te pierdas las mejores ofertas</p>
            <Link to="/products?subcategory=descuentos" className="btn-primary inline-block shadow-xl">
              Ver ofertas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
