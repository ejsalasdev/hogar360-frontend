# Hogar360 - Plataforma de Gestión Inmobiliaria

[![Angular](https://img.shields.io/badge/Angular-16-red.svg)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Jest](https://img.shields.io/badge/Jest-Testing-brightgreen.svg)](https://jestjs.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth0-purple.svg)](https://auth0.com/)
[![SCSS](https://img.shields.io/badge/SCSS-Styling-pink.svg)](https://sass-lang.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/features/actions)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://www.docker.com/)

**Hogar360** es una aplicación web moderna construida con Angular 16 que facilita la gestión integral de propiedades inmobiliarias. La plataforma conecta vendedores y compradores, proporcionando herramientas completas para la publicación, búsqueda y gestión de propiedades.

## 🏠 Características Principales

### Para Vendedores
- **Gestión de Propiedades**: Crear, editar y administrar listados de propiedades
- **Categorización**: Organizar propiedades por tipo (apartamentos, casas, etc.)
- **Horarios de Visita**: Crear y gestionar slots de tiempo para visitas
- **Ubicaciones**: Gestión completa de ubicaciones por departamento, ciudad y sector
- **Dashboard Administrativo**: Panel de control con métricas y gestión

### Para Compradores
- **Búsqueda Avanzada**: Filtrar propiedades por categoría, ubicación y texto libre
- **Visualización de Propiedades**: Vista detallada con información completa
- **Exploración por Ubicación**: Búsqueda por departamento, ciudad o sector específico

### Características Técnicas
- **Arquitectura de Microservicios**: Integración con APIs backend especializadas
- **Autenticación JWT**: Sistema seguro de autenticación y autorización
- **Roles de Usuario**: Sistema granular de permisos (Admin, Seller, Usuario)
- **Testing Completo**: Suite de tests unitarios con Jest

## 🛠️ Tecnologías

- **Frontend**: Angular 16, TypeScript, SCSS
- **Autenticación**: JWT con @auth0/angular-jwt
- **Testing**: Jest con cobertura completa
- **Build System**: Angular CLI
- **Contenización**: Docker para despliegue
- **CI/CD**: GitHub Actions con Dokploy

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm 9+
- Angular CLI 16

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd hogar360front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp src/environments/environment.example.ts src/environments/environment.ts
# Editar environment.ts con las URLs de tus APIs

# Iniciar servidor de desarrollo
npm start
```

### Scripts Disponibles
```bash
npm start          # Servidor de desarrollo (puerto 4200)
npm run build      # Build de producción
npm test           # Ejecutar tests unitarios
npm run test:watch # Tests en modo watch
npm run test:coverage # Tests con reporte de cobertura
npm run lint       # Linting del código
```

## 🌍 Configuración de Entornos

La aplicación está configurada para usar diferentes URLs según el entorno:

### Desarrollo (Localhost)
```bash
ng serve  # Usa automáticamente localhost:8081, 8082, 8083
```

### Producción (Hogar360.site)
```bash
npm run build -- --configuration production  # Usa automáticamente hogar360.site domains
```

### URLs por Entorno
| Servicio | Desarrollo | Producción |
|----------|------------|------------|
| Property API | `http://localhost:8081` | `https://property.hogar360.site` |
| User API | `http://localhost:8082` | `https://user.hogar360.site` |
| Visit API | `http://localhost:8083` | `https://visit.hogar360.site` |

**Nota**: El cambio de entorno es automático según el comando de build que uses.

## 🏗️ Arquitectura

### Estructura del Proyecto
```
src/
├── app/
│   ├── core/                 # Servicios, modelos, interceptors
│   │   ├── models/          # Interfaces TypeScript
│   │   ├── services/        # Servicios de negocio
│   │   └── interceptors/    # HTTP interceptors
│   ├── shared/              # Componentes y utilidades compartidas
│   └── ui/                  # Componentes de interfaz
│       ├── atoms/           # Componentes básicos reutilizables
│       ├── molecules/       # Componentes compuestos
│       ├── organisms/       # Componentes complejos
│       ├── pages/           # Páginas de la aplicación
│       └── layout/          # Componentes de layout
├── assets/                  # Recursos estáticos
├── environments/            # Configuraciones de entorno
└── styles/                  # Estilos globales
```

### Patrones de Diseño
- **Atomic Design**: Organización jerárquica de componentes
- **Repository Pattern**: Abstracción de acceso a datos
- **Interceptor Pattern**: Manejo centralizado de HTTP requests
- **Role-based Access Control**: Control de acceso granular

## 🌐 Funcionalidades por Módulo

### Dashboard
Panel principal con métricas y navegación centralizada

### Gestión de Propiedades
- CRUD completo de propiedades
- Filtros por categoría y ubicación
- Paginación y ordenamiento
- Validaciones de formulario robustas

### Gestión de Ubicaciones
- Administración de departamentos, ciudades y sectores
- Búsqueda y filtrado avanzado
- Validación de datos geográficos

### Gestión de Categorías
- Clasificación de tipos de propiedad
- Administración centralizada

### Sistema de Usuarios
- Gestión de roles y permisos
- Perfil de usuario
- Autenticación segura

### Horarios de Visita
- Creación de slots de tiempo
- Validaciones de fechas y horarios
- Gestión por propiedad

## 🔧 Configuración

### Variables de Entorno
```typescript
export const environment = {
  production: false,
  propertyApiUrl: 'http://localhost:8080',
  userApiUrl: 'http://localhost:8081',
  // ... otras configuraciones
};
```

### Configuración Docker
La aplicación incluye configuración Docker optimizada para producción:
- Multi-stage build
- Nginx como servidor web
- Imágenes ligeras y optimizadas

## 🧪 Testing

El proyecto mantiene una cobertura de tests alta con Jest:

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 🚀 Despliegue

### Docker
```bash
# Build de la imagen
docker build -t hogar360front .

# Ejecutar contenedor
docker run -p 80:80 hogar360front
```

### CI/CD
El proyecto incluye workflow de GitHub Actions para:
- Linting automático
- Ejecución de tests
- Build y push a Docker Hub
- Despliegue automático con Dokploy

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- 📧 Email: soporte@hogar360.com
- 📱 Teléfono: 1-800-HOGAR360
- 🌐 Website: [hogar360.com](https://hogar360.com)

---

**Hogar360** - *Tu partner en la búsqueda del espacio perfecto* 🏠
