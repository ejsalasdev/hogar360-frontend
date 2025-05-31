# GitHub Actions Workflow

Este directorio contiene el workflow de GitHub Actions para la aplicación Angular Hogar360.

## Workflow principal (`deploy.yml`)

Workflow que construye y publica imagen Docker, compatible con Dokploy:

- **Trigger**: Push a rama `develop`
- **Funciones**:
  - ✅ Linting con ESLint
  - ✅ Tests unitarios con cobertura
  - ✅ Build de imagen Docker multi-stage
  - ✅ Push a Docker Hub
  - ✅ Compatible con Dokploy para auto-deploy

## Configuración Docker

### Dockerfile multi-stage
- **Stage 1**: Build con Node.js 18 Alpine
- **Stage 2**: Producción con Nginx Alpine (solo archivos estáticos)

### Secrets requeridos en GitHub
- `DOCKERHUB_USERNAME`: Tu usuario de Docker Hub
- `DOCKERHUB_TOKEN`: Tu token de acceso de Docker Hub

## Configuración en Dokploy

1. **Crear nueva aplicación en Dokploy:**
   - Tipo: Docker
   - Registry: Docker Hub
   - Image: `tu-usuario/hogar360front:latest`
   - Puerto: 80

2. **El auto-deploy funciona automáticamente:**
   - Push a `develop` → GitHub Actions construye imagen
   - Dokploy detecta nueva imagen → Deploy automático

## Uso

- **Desarrollo**: Push a `develop` ejecuta tests, build y deploy automático
- **Imagen Docker**: Disponible en `tu-usuario/hogar360front:latest`
- **Frontend**: Servido por Nginx en puerto 80

## Estructura del proyecto

```
├── Dockerfile          # Multi-stage build (Node.js + Nginx)
├── .dockerignore       # Archivos ignorados en build
├── .github/
│   └── workflows/
│       └── deploy.yml  # Workflow de CI/CD
```
