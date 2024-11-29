# Lira Mayoristas - B2B Pet Food Distribution Platform

Plataforma de distribución B2B para Lira Mayoristas, especializada en la distribución de alimentos para mascotas.

## Tecnologías

- Vue 3
- Ionic Framework
- TypeScript
- Capacitor (iOS/Android)
- Vite

## Características

- Catálogo de productos con filtros avanzados
- Sistema de búsqueda
- Filtrado por categorías
- Ordenamiento personalizado
- Filtros de precio y stock
- Diseño responsive
- Soporte para iOS nativo

## Requisitos

- Node.js 16+
- npm o yarn
- Xcode (para desarrollo iOS)
- CocoaPods

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Aplicaciones-Web-Chile/lira-mayoristas.git
cd lira-mayoristas
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

4. Para desarrollo iOS:
```bash
npm run ios
```

## Estructura del Proyecto

```
src/
  ├── assets/        # Recursos estáticos
  ├── components/    # Componentes Vue reutilizables
  ├── layouts/       # Layouts de la aplicación
  ├── services/      # Servicios y lógica de negocio
  ├── types/         # Definiciones de TypeScript
  └── views/         # Páginas de la aplicación
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run ios`: Construye y sincroniza la aplicación con iOS
- `npm run lint`: Ejecuta el linter
- `npm run preview`: Vista previa de la versión de producción

## Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto es privado y propietario. Todos los derechos reservados.
