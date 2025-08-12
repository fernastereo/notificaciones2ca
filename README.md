## Gestión de Publicaciones 2CA

Aplicación web construida con Vue 3 + Vite para la gestión interna de la Curaduría Urbana 2 de Cartagena. Incluye autenticación, gestión de publicaciones (listado, creación y edición), transiciones amigables entre vistas, paginación local y carga incremental.

### API Backend utilizada
Esta aplicación consume la API del proyecto "API Curaduría 2 Cartagena". Puedes consultar su código y documentación aquí:
- Repositorio: [fernastereo/apiCuraduria2ca](https://github.com/fernastereo/apiCuraduria2ca)

Nota: Los nombres de campos de subida de archivo pueden diferir según la versión del backend. Este frontend envía `multipart/form-data` con `datos` (JSON string) y `archivo` (File). Si tu backend espera otro nombre (por ejemplo `publicacionFile`), ajusta el nombre del campo en `usePublicaciones.js` para alinearlo con la API del repositorio anterior.

### Requisitos previos
- Node.js 18 o superior (recomendado)
- npm 9 o superior

### Instalación
```bash
npm install
```

### Variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con la URL base del API:
```bash
VITE_BASE_API_URL=https://tu-api.example.com
VITE_BASE_URL=/carpeta-instalacion/
VITE_AWS_URL=https://tu-ruta-al-bucket-de-aws-s3.com
```
Endpoints usados actualmente por la app:
- Autenticación: `POST /login`, `POST /register`
- Publicaciones: `GET /publicaciones`, `GET /publicaciones/:id`, `POST /publicaciones`, `PUT /publicaciones/:id`, `DELETE /publicaciones/:id`
- Tipos de publicación: `GET /tipos-publicacion`

Notas importantes para el backend:
- En creación/edición de publicaciones se envía `multipart/form-data` con:
  - `datos`: JSON string con el payload
  - `archivo`: File (opcional en edición)
- No establecer manualmente el header `Content-Type` para FormData (el navegador lo define con el boundary correcto).

### Scripts disponibles
```bash
# Desarrollo (hot reload)
npm run dev

# Compilación producción
npm run build

# Previsualizar build
npm run preview

# Pruebas unitarias (Vitest)
npm run test:unit
```

### Estructura del proyecto (resumen)
- `src/main.js`: bootstrap de la app
- `src/router/index.js`: rutas públicas y protegidas, anidadas en `home`
- `src/views/`: vistas de nivel superior (`LoginView`, `RegisterView`, `HomeView`, `PublicacionesView`)
- `src/components/publicaciones/`: componentes de Publicaciones (`PublicacionesList.vue`, `PublicacionesForm.vue`)
- `src/composables/`: lógica reutilizable (`useAuth.js`, `usePublicaciones.js`, `useTiposPublicacion.js`)
- `src/assets/`: recursos estáticos y estilos

### Rutas principales
- `GET /` → `LoginView`
- `GET /register` → `RegisterView`
- `GET /home` → layout autenticado (contiene rutas hijas)
  - `GET /home/publicaciones` → `PublicacionesList.vue`
  - `GET /home/publicaciones/nuevo` → `PublicacionesForm.vue` (creación)
  - `GET /home/publicaciones/editar/:id` → `PublicacionesForm.vue` (edición)

La vista `PublicacionesView.vue` envuelve al `<RouterView>` con una transición suave para mejorar la UX al cambiar entre lista y formulario.

### Autenticación (`useAuth`)
Composable en `src/composables/useAuth.js` que maneja:
- `login({ username, password })`
- `logout()`
- `checkAuth()`
- `register({ username, password, email, nombre })` → el login se realiza automáticamente tras un registro exitoso
- `token`, `user`, `authError`, `isAuthenticated`

Uso básico en `RegisterView.vue`:
```js
const { register } = useAuth()
await register({ username, password, email, nombre })
```

### Publicaciones (`usePublicaciones`)
Composable en `src/composables/usePublicaciones.js` que expone:
- Estado: `publicaciones` (paginadas localmente), `publicacionesFiltradas`, `filtros`, `loading`, `loadingBackground`, `paginacion`, `totalPaginas`, `apiError`
- Métodos:
  - `getPublicacionesIniciales()` → carga 10 primeras y dispara carga en background del resto del año actual
  - `getPublicacionById(id)`
  - `createPublicacion(payload)`
  - `updatePublicacion(id, payload)`
  - `deletePublicacion(id)`
  - `actualizarFiltros(partial)` / `limpiarFiltros()`
  - `cambiarPagina(n)` / `cambiarPorPagina(n)`

Payload para crear/editar publicaciones (campo `datos` dentro de FormData):
```json
{
  "fecha": "2024-03-21",
  "fechapublicacion": "2024-03-22",
  "referencia": "PUB-2024-001",
  "archivo": "documentos/resolucion_123_2024.pdf",
  "estado": 1,
  "tipopublicacion_id": 1
}
```
Respuesta esperada del API:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "fecha": "2024-03-21",
      "fechapublicacion": "2024-03-22",
      "referencia": "PUB-2024-001",
      "archivo": "documentos/resolucion_123_2024.pdf",
      "estado": 1,
      "tipopublicacion_id": 1,
      "tipo_descripcion": "COMUNICACION A VECINOS"
    }
  ]
}
```

Características clave implementadas:
- Carga inicial rápida: 10 publicaciones al primer render
- Carga incremental en background: resto del año actual sin bloquear UI
- Filtros locales: búsqueda por `referencia`, `tipopublicacion_id`, `estado`
- Paginación local: selector de tamaño de página y navegación (primera, anterior, siguiente, última)
- Formato de fecha en tabla: `DD-MM-YYYY`

### Tipos de publicación (`useTiposPublicacion`)
Composable en `src/composables/useTiposPublicacion.js`:
- `tiposPublicacion`, `loading`, `apiError`
- `getTiposPublicacion()`

Se usa en `PublicacionesForm.vue` y `PublicacionesList.vue` para poblar selects dinámicos desde el API `GET /tipos-publicacion`.

### Componentes clave
- `PublicacionesList.vue`
  - Lista con filtros, paginación local, botón "Nueva Publicación"
  - Indicador de carga incremental en background
  - Acciones: ver, editar, eliminar (con confirmación)
- `PublicacionesForm.vue`
  - Creación y edición
  - Subida de archivo con drag & drop
  - En edición, selector de `estado`
  - Notificaciones de éxito/error y redirección tras guardar

### Estilos y UI
- Tailwind CSS
- Heroicons
- Transiciones entre vistas en `PublicacionesView.vue`

### Pruebas
- Vitest + Vue Test Utils (`npm run test:unit`)

### Despliegue
1. Configura variables de entorno a usar en el servidor
2. Genera build de producción:
```bash
npm run build
```
3. Sirve la carpeta `dist/` con tu servidor estático preferido o integra con tu plataforma de hosting.

### Solución de problemas
- CORS: asegúrate de permitir el origen del front en el API
- Subida de archivos: no fuerces `Content-Type`; usa `FormData`
- Tokens: `useAuth` persiste token/usuario en `localStorage`

### Convenciones
- Vue 3 Composition API y `<script setup>`
- Composables centralizan llamadas a API y estados
- Filtros y paginación se manejan en cliente para respuesta inmediata

---
Si necesitas ampliar esta documentación (p. ej., modelos de datos, roles/permisos, o pipeline CI/CD), avísame y lo integramos. 
