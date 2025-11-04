import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Comprar */}
          <div>
            <h5 className="font-semibold mb-4">Comprar</h5>
            <ul className="space-y-2">
              <li><Link to="/products?category=mujer" className="text-gray-400 hover:text-white transition">Mujer</Link></li>
              <li><Link to="/products?category=hombre" className="text-gray-400 hover:text-white transition">Hombre</Link></li>
              <li><Link to="/products?category=zapatos" className="text-gray-400 hover:text-white transition">Zapatos</Link></li>
              <li><Link to="/products?category=sale" className="text-gray-400 hover:text-white transition">Sale</Link></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h5 className="font-semibold mb-4">Ayuda</h5>
            <ul className="space-y-2">
              <li><Link to="/orders" className="text-gray-400 hover:text-white transition">Estado del pedido</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Envíos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Devoluciones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contacto</a></li>
            </ul>
          </div>

          {/* Sobre Nosotros */}
          <div>
            <h5 className="font-semibold mb-4">Sobre Nosotros</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Nuestra historia</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Sostenibilidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Carreras</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Prensa</a></li>
            </ul>
          </div>

          {/* Síguenos */}
          <div>
            <h5 className="font-semibold mb-4">Síguenos</h5>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Instagram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 ÉLITE Fashion Store. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
