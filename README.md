#  Elite E-Commerce# ÉLITE E-Commerce



Plataforma de comercio electrónico moderna y completa con gestión de productos, usuarios, órdenes y sistema financiero integrado.E-commerce moderno y completo construido con React, Node.js, Express y SQLite.



##  Características##  Características



###  Frontend### Frontend (Cliente)

- **React 18** con Vite para desarrollo rápido-  React 18 + Vite

- **Tailwind CSS** para diseño moderno y responsive-  Tailwind CSS para diseño responsive

- **React Router** para navegación fluida- React Router para navegación

- Carrito de compras con persistencia en localStorage-  Context API para estado global

- Sistema de autenticación con JWT-  Carrito de compras persistente

- Panel de administración completo-  Autenticación de usuarios

- Búsqueda en tiempo real-  Pasarela de pagos (Stripe ready)

- Notificaciones toast elegantes-  Búsqueda y filtros de productos



### ⚙️ Backend### Panel de Administración

- **Node.js** con Express-  Dashboard con estadísticas

- **SQLite** como base de datos (fácil de migrar a PostgreSQL/MySQL)-  Gestión de productos (CRUD)

- **Sequelize ORM** para gestión de base de datos-  Gestión de pedidos

- Autenticación JWT segura-  Gestión de usuarios

- Upload de imágenes con Multer-  Subida de imágenes

- Rate limiting para protección contra ataques-  Reportes y analytics

- Sistema de transacciones financieras

- API RESTful completa### Backend (API)

-  Node.js + Express

### 🛒 Funcionalidades Principales-  SQLite + Sequelize ORM

-  JWT Authentication

#### Para Clientes:-  Bcrypt para passwords

- Navegación por categorías (Mujer, Hombre, Unisex)-  Validación de datos

- Filtrado por subcategorías (Camisas, Pantalones, Zapatos, Accesorios, Gorras, Medias, Descuentos)-  Middleware de seguridad

- Sistema de tallas dinámico (letras para ropa, números para zapatos)-  API RESTful

- Productos destacados y ofertas

- Carrito de compras persistente##  Requisitos Previos

- Checkout seguro

- Historial de órdenes- Node.js 18+ 

- Perfil de usuario editable con foto- npm (incluido con Node.js)



#### Para Administradores:**¡No necesitas instalar ninguna base de datos!** SQLite está integrado.

- Dashboard con estadísticas en tiempo real

- Gestión completa de productos (CRUD)## 🛠️ Instalación

- Sistema de descuentos con slider visual (20-90%)

- Gestión de usuarios y roles### 1. Clonar el repositorio

- Gestión de órdenes

- Sistema financiero integrado:```bash

  - Registro automático de ventas como ingresosgit clone <tu-repo>

  - Registro automático de inventario como gastoscd elite-ecommerce

  - 10 categorías de transacciones```

  - Filtros avanzados y reportes

  - Cálculo de profit margin### 2. Instalar dependencias del Backend

- Upload de múltiples imágenes por URL

- Validación de formularios```bash

- Sistema de colores y tallascd backend

npm install

###  Sistema Financiero```

- **Auto-registro**: Ventas e inventario se registran automáticamente

- **Tipos**: Income (ventas, reembolsos, otros) | Expenses (inventario, envíos, marketing, salarios, etc.)### 3. Configurar variables de entorno del Backend

- **Reportes**: Total ingresos, gastos, ganancia neta, margen de beneficio

- **Filtros**: Por tipo, categoría, rango de fechasCrear archivo `.env` en `/backend`:



##  Instalación```env

PORT=5000

### PrerequisitosMONGODB_URI=mongodb://localhost:27017/elite-ecommerce

- Node.js 16+ JWT_SECRET=tu_clave_secreta_muy_segura_aqui

- npm o yarnNODE_ENV=development

CLIENT_URL=http://localhost:5173

### Backend```



```bash### 4. Instalar dependencias del Frontend

cd backend

npm install```bash

cd ../frontend

# Configurar variables de entornonpm install

cp .env.example .env```

# Editar .env con tus valores

### 5. Configurar variables de entorno del Frontend

# Iniciar servidor

npm run devCrear archivo `.env` en `/frontend`:

```

```env

### FrontendVITE_API_URL=http://localhost:5000/api

```

```bash

cd frontend##  Ejecutar en Desarrollo

npm install

npm run dev### Terminal 1 - Backend

``````bash

cd backend

##  Configuraciónnpm run dev

```

### Variables de Entorno (Backend)

### Terminal 2 - Frontend

```env```bash

NODE_ENV=developmentcd frontend

PORT=5000npm run dev

JWT_SECRET=tu_secreto_super_seguro_aqui```

```

La aplicación estará disponible en:

### Variables de Entorno (Frontend)- Frontend: http://localhost:5173

- Backend API: http://localhost:5000

```env- Admin Panel: http://localhost:5173/admin

VITE_API_URL=http://localhost:5000

```##  Usuarios por Defecto



##  Scripts DisponiblesDespués de ejecutar `npm run seed` en el backend:



### Backend**Admin:**

```bash- Email: admin@elite.com

npm run dev        # Inicia servidor en modo desarrollo- Password: admin123

npm start          # Inicia servidor en producción

```**Usuario:**

- Email: user@elite.com

### Frontend- Password: user123

```bash

npm run dev        # Inicia Vite dev server##  Despliegue con Docker

npm run build      # Build para producción

npm run preview    # Preview del build```bash

```docker-compose up -d

```

##  Estructura del Proyecto

##  Estructura del Proyecto

```

elite-ecommerce/```

├── backend/elite-ecommerce/

│   ├── src/├── frontend/                # Aplicación React

│   │   ├── config/         # Configuración de DB│   ├── src/

│   │   ├── controllers/    # Lógica de negocio│   │   ├── components/     # Componentes reutilizables

│   │   ├── middleware/     # Auth, rate limiting│   │   ├── pages/          # Páginas

│   │   ├── models/         # Modelos Sequelize│   │   ├── context/        # Context API

│   │   ├── routes/         # Rutas de API│   │   ├── services/       # API calls

│   │   ├── scripts/        # Scripts de utilidad│   │   ├── hooks/          # Custom hooks

│   │   └── server.js       # Punto de entrada│   │   └── types/          # TypeScript types

│   ├── uploads/            # Imágenes subidas│   └── package.json

│   └── package.json│

├── frontend/├── backend/                 # API REST

│   ├── src/│   ├── src/

│   │   ├── components/     # Componentes reutilizables│   │   ├── models/         # Modelos Mongoose

│   │   ├── context/        # Context API (Auth, Cart)│   │   ├── routes/         # Rutas API

│   │   ├── pages/          # Páginas de la app│   │   ├── controllers/    # Lógica de negocio

│   │   ├── services/       # API calls│   │   ├── middleware/     # Middleware

│   │   ├── utils/          # Utilidades│   │   └── config/         # Configuración

│   │   └── App.jsx         # Componente principal│   └── package.json

│   └── package.json│

└── README.md└── docker-compose.yml       # Orquestación Docker

``````



##  Credenciales por Defecto## Seguridad



**Administrador:**- Passwords hasheados con bcrypt

- Email: `admin@elite.com`-  JWT tokens con expiración

- Password: `admin123`-  CORS configurado

-  Helmet.js para headers HTTP

 
-  Validación de inputs

## 🎯 API Endpoints-  MongoDB injection prevention



### Autenticación##  API Endpoints

- `POST /api/auth/register` - Registrar usuario

- `POST /api/auth/login` - Iniciar sesión### Auth

- `GET /api/auth/profile` - Obtener perfil- POST `/api/auth/register` - Registrar usuario

- POST `/api/auth/login` - Login

### Productos- GET `/api/auth/me` - Usuario actual

- `GET /api/products` - Listar productos

- `GET /api/products/:id` - Ver producto### Products

- `POST /api/products` - Crear producto (Admin)- GET `/api/products` - Listar productos

- `PUT /api/products/:id` - Actualizar producto (Admin)- GET `/api/products/:id` - Obtener producto

- `DELETE /api/products/:id` - Eliminar producto (Admin)- POST `/api/products` - Crear (Admin)

- PUT `/api/products/:id` - Actualizar (Admin)

### Órdenes- DELETE `/api/products/:id` - Eliminar (Admin)

- `GET /api/orders` - Listar órdenes

- `POST /api/orders` - Crear orden### Orders

- `PUT /api/orders/:id` - Actualizar orden- GET `/api/orders` - Mis pedidos

- GET `/api/orders/:id` - Obtener pedido

### Finanzas- POST `/api/orders` - Crear pedido

- `GET /api/transactions` - Listar transacciones- PUT `/api/orders/:id` - Actualizar estado (Admin)

- `POST /api/transactions` - Crear transacción

- `GET /api/transactions/summary` - Resumen financiero### Users

- GET `/api/users` - Listar usuarios (Admin)

## Seguridad- GET `/api/users/:id` - Obtener usuario (Admin)

- PUT `/api/users/:id` - Actualizar usuario

- Autenticación JWT- DELETE `/api/users/:id` - Eliminar usuario (Admin)

- Contraseñas hasheadas con bcrypt

- Rate limiting (500 req/min dev, 100 req/min prod)##  Contribuir

- Validación de datos en backend y frontend

- CORS configurado1. Fork el proyecto

- Sanitización de inputs2. Crea tu rama (`git checkout -b feature/AmazingFeature`)

3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)

##  Características Destacadas4. Push a la rama (`git push origin feature/AmazingFeature`)

5. Abre un Pull Request

### Sistema de Categorías Inteligente

- **Mixta (Unisex)**: Los productos mixtos aparecen automáticamente en secciones de Hombre y Mujer## 📄 Licencia

- **Tallas Dinámicas**: Cambia automáticamente entre números (zapatos) y letras (ropa)

MIT License

### UX Mejorada

- Sin alerts - Todo con toast notifications##  Próximas Características

- Validación en tiempo real

- Feedback visual inmediato- [ ] Integración con Stripe/PayPal

- Diseño dark mode elegante- [ ] Notificaciones por email

- [ ] Wishlist

### Sistema de Descuentos- [ ] Reviews y ratings

- Slider visual 20-90%- [ ] Recomendaciones de productos

- Cálculo automático de precio final- [ ] Chat de soporte

- Precio tachado visible- [ ] Multi-idioma

- Badge de descuento en tarjetas- [ ] PWA (Progressive Web App)



## 📱 Responsive Design---



Completamente adaptado para:Desarrollado con  para producción

- 📱 Móviles
- 📱 Tablets  
- 💻 Desktop
- 🖥️ Large screens


##  Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

##  Desarrollado por

Camilo Lopez Romero

---

Si te gusta este proyecto, dale una estrella en GitHub.
