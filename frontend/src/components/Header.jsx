import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const subcategories = [
    { name: 'Camisas', value: 'camisas' },
    { name: 'Pantalones', value: 'pantalones' },
    { name: 'Zapatos', value: 'zapatos' },
    { name: 'Accesorios', value: 'accesorios' },
    { name: 'Gorras', value: 'gorras' },
    { name: 'Medias', value: 'medias' },
    { name: 'Descuentos', value: 'descuentos' }
  ];

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isUserMenuOpen || isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="fixed top-0 w-full bg-black/80 backdrop-blur-xl z-50 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wider">
            ÉLITE
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {/* Mujer Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('mujer')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link to="/products?category=mujer" className="hover:text-gray-300 transition">
                Mujer
              </Link>
              {openDropdown === 'mujer' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 border border-white/10 animate-fadeIn">
                  {subcategories.map(sub => (
                    <Link
                      key={sub.value}
                      to={`/products?category=mujer&subcategory=${sub.value}`}
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Hombre Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('hombre')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link to="/products?category=hombre" className="hover:text-gray-300 transition">
                Hombre
              </Link>
              {openDropdown === 'hombre' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 border border-white/10 animate-fadeIn">
                  {subcategories.map(sub => (
                    <Link
                      key={sub.value}
                      to={`/products?category=hombre&subcategory=${sub.value}`}
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Mixta Dropdown */}
            <li 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('mixta')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link to="/products?category=mixta" className="hover:text-gray-300 transition">
                Unisex
              </Link>
              {openDropdown === 'mixta' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 border border-white/10 animate-fadeIn">
                  {subcategories.map(sub => (
                    <Link
                      key={sub.value}
                      to={`/products?category=mixta&subcategory=${sub.value}`}
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:text-gray-300 transition"
              >
                <FiSearch size={20} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-lg p-4 border border-white/10 animate-fadeIn">
                  <form onSubmit={handleSearch}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar productos..."
                        className="flex-1 px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                      >
                        <FiSearch size={20} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="hover:text-gray-300 transition flex items-center"
                >
                  <FiUser size={20} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg py-2 border border-white/10 animate-fadeIn">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                    >
                      Mi Perfil
                    </Link>
                    <Link 
                      to="/orders" 
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-800 transition"
                    >
                      Mis Pedidos
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-800 text-yellow-400 transition"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-800 text-red-400 transition"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-gray-300 transition">
                <FiUser size={20} />
              </Link>
            )}

            <Link to="/cart" className="hover:text-gray-300 transition relative">
              <FiShoppingBag size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <ul className="space-y-2">
              <li><Link to="/products?category=mujer" className="block py-2 hover:text-gray-300">Mujer</Link></li>
              <li><Link to="/products?category=hombre" className="block py-2 hover:text-gray-300">Hombre</Link></li>
              <li><Link to="/products?category=zapatos" className="block py-2 hover:text-gray-300">Zapatos</Link></li>
              <li><Link to="/products?category=accesorios" className="block py-2 hover:text-gray-300">Accesorios</Link></li>
              <li><Link to="/products?category=sale" className="block py-2 text-red-400">Sale</Link></li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
