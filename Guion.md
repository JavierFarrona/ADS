# PetRescue — Guion de Presentación

## Resumen del Proyecto
- Aplicación full‑stack para gestionar animales y refugios.
- Frontend en React + Vite + TypeScript (`client/`), backend en Node.js + Express + Mongoose (`server/`).
- Persistencia en MongoDB; si no hay base disponible, usa una instancia en memoria con `mongodb-memory-server`.
- API REST con recursos `animals` y `shelters`, validación con `Joi`, CORS habilitado y registro de peticiones con `morgan`.

## Arquitectura
- Capas:
  - UI (React) → `axios` → API (Express) → Mongoose → MongoDB.
- Conexión BD:
  - Intenta `MONGO_URI` (por defecto `mongodb://127.0.0.1:27017/petrescue`) y, si falla, levanta Mongo en memoria.
- Comunicación:
  - `axios` consume la API con base `VITE_API_BASE` (por defecto `http://localhost:4000`).

```
[React UI] --HTTP--> [Express API] --ODM--> [Mongoose] --wire--> [MongoDB | In-Memory]
```

## Tecnologías
- Backend: `express`, `mongoose`, `joi`, `cors`, `morgan`, `mongodb-memory-server`.
- Frontend: `react`, `react-router-dom`, `axios`, `@vitejs/plugin-react`, TypeScript, ESLint.

## Estructura de Carpetas
- `client/` (frontend)
  - `src/` componentes y lógica: `App.tsx`, `pages/`, `api.ts`, estilos.
  - `public/` estáticos.
  - Configuración: `vite.config.ts`, `eslint.config.js`, `tsconfig*`, `package.json`.
- `server/` (backend)
  - `src/server.js` arranque y configuración.
  - `src/models/` esquemas `Animal.js`, `Shelter.js`.
  - `src/routes/` routers `animals.js`, `shelters.js`.
  - `src/seed.js` script de semilla.
  - `package.json` scripts y dependencias.

## Backend (API)
- Servidor y middleware
  - JSON, CORS y logs de peticiones.
  - Endpoint salud `GET /` devuelve servicio y conteo de animales.
  - Referencias: `server/src/server.js:17`, `server/src/server.js:18`, `server/src/server.js:19`, `server/src/server.js:21`.
- Conexión BD
  - Intenta `MONGO_URI`; si falla, activa `mongodb-memory-server` y conecta.
  - Referencias: `server/src/server.js:60`, `server/src/server.js:66`, `server/src/server.js:69`.
- Seeding
  - `ensureSeed()` añade 5 refugios y 5 animales si hay pocos registros.
  - Script manual: `node src/seed.js`.
  - Referencias: `server/src/server.js:33`, `server/src/seed.js:8`.
- Validación y errores
  - `Joi` valida payloads en `POST/PUT`.
  - Validación de `ObjectId` en rutas `/:id`.
  - Handler de errores 500 genérico.
  - Referencias: `server/src/routes/animals.js:57`, `server/src/routes/shelters.js:41`, `server/src/server.js:29`.

### Endpoints

| Recurso    | Método | Ruta                      | Descripción                                  |
|------------|--------|---------------------------|----------------------------------------------|
| Animals    | GET    | `/animals`                | Lista todos                                   |
| Animals    | GET    | `/animals/:id`            | Detalle por id                                |
| Animals    | GET    | `/animals/search?q=...`   | Búsqueda por índice texto                     |
| Animals    | POST   | `/animals`                | Crear (convierte `shelterId` a `ObjectId`)    |
| Animals    | PUT    | `/animals/:id`            | Actualizar                                    |
| Animals    | DELETE | `/animals/:id`            | Eliminar                                      |
| Shelters   | GET    | `/shelters`               | Lista todos                                   |
| Shelters   | GET    | `/shelters/:id`           | Detalle por id                                |
| Shelters   | POST   | `/shelters`               | Crear                                         |
| Shelters   | PUT    | `/shelters/:id`           | Actualizar                                    |
| Shelters   | DELETE | `/shelters/:id`           | Eliminar                                      |

Referencias: `server/src/routes/animals.js:16`, `server/src/routes/animals.js:25`, `server/src/routes/animals.js:41`, `server/src/routes/animals.js:55`, `server/src/routes/animals.js:71`, `server/src/routes/animals.js:95`, `server/src/routes/shelters.js:14`, `server/src/routes/shelters.js:23`, `server/src/routes/shelters.js:39`, `server/src/routes/shelters.js:52`, `server/src/routes/shelters.js:72`.

## Modelos de Datos

### Animal
- Campos: `name`, `species`, `age`, `shelterId` (ref `Shelter`), `description`.
- Índice de texto en `name` y `description` para búsquedas.
- Referencia: `server/src/models/Animal.js:3`, `server/src/models/Animal.js:14`.

### Shelter
- Campos: `name`, `address`, `capacity`.
- Referencia: `server/src/models/Shelter.js:3`.

## Frontend (UI)
- Entradas y rutas
  - Montaje con `BrowserRouter`.
  - Rutas: `/`, `/animals/new`, `/animals/:id`, `/animals/:id/edit`, `/shelters`.
  - Referencias: `client/src/main.tsx:9`, `client/src/App.tsx:21`.
- API client
  - `axios` con `baseURL` configurable: `VITE_API_BASE`.
  - Tipos TS `Animal` y `Shelter` comparten forma de datos.
  - Referencias: `client/src/api.ts:3`, `client/src/api.ts:5`, `client/src/api.ts:10`, `client/src/api.ts:19`.
- Páginas
  - `Home.tsx`: lista y buscador; navega al detalle al hacer click.
  - `AnimalDetails.tsx`: modos `view/edit/create`, guarda (`POST/PUT`) y elimina (`DELETE`), carga el shelter asociado.
  - `Shelters.tsx`: CRUD con edición inline y recarga tras operación.
  - Referencias: `client/src/pages/Home.tsx:12`, `client/src/pages/Home.tsx:46`, `client/src/pages/AnimalDetails.tsx:6`, `client/src/pages/AnimalDetails.tsx:33`, `client/src/pages/AnimalDetails.tsx:43`, `client/src/pages/AnimalDetails.tsx:64`, `client/src/pages/AnimalDetails.tsx:78`, `client/src/pages/Shelters.tsx:29`, `client/src/pages/Shelters.tsx:35`, `client/src/pages/Shelters.tsx:41`.

## Flujos de Datos
- Buscar animales
  - El usuario escribe y pulsa “Search”; el frontend llama `/animals/search?q=...` y muestra tarjetas.
- Ver detalle
  - Click en tarjeta → `/animals/:id`; muestra info del animal y su shelter; acciones “Editar” y “Eliminar”.
- Crear/editar animal
  - “New” → formulario con shelters; guardar crea con `POST`. En edición, `PUT`; eliminar con `DELETE`.
- CRUD shelters
  - Crear en formulario superior; en lista, “Editar” abre inline; “Eliminar” borra y refresca.

### Diagrama de Secuencia (Crear Animal)
```
User -> UI(Home): Click "New"
UI -> UI(AnimalDetails create): Render form + load shelters
UI -> API: POST /animals { name, species, age, shelterId, description }
API -> DB(Mongo): insert Animal (Joi valida, shelterId -> ObjectId)
DB -> API: ok (201)
API -> UI: ok
UI -> Router: navigate "/"
UI(Home) -> API: GET /animals
UI(Home): render lista actualizada
```

## Cómo Ejecutar
- Variables de entorno
  - Backend: `MONGO_URI`, `PORT`, `CLIENT_ORIGIN`.
  - Frontend: `VITE_API_BASE`.
- Arranque
  - Backend (`server/`):
    - `npm run start` → `http://localhost:4000`
  - Frontend (`client/`):
    - `npm run dev` → `http://localhost:5173`
- Semilla
  - Automática si faltan datos.
  - Manual: en `server/` ejecutar `node src/seed.js`.

## Demo Paso a Paso
- Iniciar backend (`server/`) y verificar: `Server listening on http://localhost:4000` (`server/src/server.js:71`).
- Iniciar frontend (`client/`) y abrir `http://localhost:5173`.
- Probar:
  - Home: listar y buscar “Dog” o “Cat”.
  - Detalle: editar y eliminar un animal.
  - Crear animal: seleccionar shelter y guardar.
  - Shelters: crear, editar inline y eliminar.
- API rápida:
  - `GET http://localhost:4000/animals`
  - `GET http://localhost:4000/animals/search?q=Bella`
  - `POST http://localhost:4000/animals` con JSON válido.

## Decisiones de Diseño
- Fallback a Mongo en memoria para demos sin instalación local.
- Validación con `Joi` para robustez de la API.
- Índice de texto en `Animal` para búsqueda eficiente.
- Uso de `.lean()` para respuestas más ligeras.
- Separación nítida de modelos/routers y tipos compartidos en frontend.

## Seguridad y Buenas Prácticas
- CORS controlado por `CLIENT_ORIGIN` para restringir orígenes del frontend.
- Validación de `ObjectId` evita accesos con IDs inválidos.
- Sin exposición de secretos en código; se recomienda usar variables de entorno.
- Logging con `morgan` en formato `dev` para auditoría básica.
- Sugerencias de producción: rate limiting, helmet, validación de relaciones (`shelterId` existente), autenticación.

## Mejoras Futuras
- Autenticación y roles (admin/usuario).
- Paginación y filtros avanzados (especie, edad, refugio).
- Subida de imágenes y almacenamiento.
- Tests unitarios/integración con cobertura sobre validaciones y rutas.
- Manejo de errores más detallado en UI (toasts/alerts).
- Persistencia real obligatoria (evitar memoria en producción).

## Troubleshooting
- CORS bloqueado: ajustar `CLIENT_ORIGIN` y `VITE_API_BASE`.
- Mongo no disponible: se usa memoria automáticamente; para persistencia, definir `MONGO_URI`.
- IDs inválidos: la API responde 400 “Invalid id”.
- Build/lint:
  - Frontend: `npm run build`, `npm run lint`.
  - Backend: puede añadirse ESLint/Prettier si se desea.

## Preguntas Típicas y Respuestas
- ¿Por qué `mongodb-memory-server`?
  - Permite correr y probar sin instalar Mongo; ideal para demos y CI. No persiste datos entre reinicios.
- ¿Cómo se valida la entrada?
  - `Joi` en `POST/PUT` y verificación de `ObjectId` en rutas con `/:id`.
- ¿Cómo es el flujo de creación/edición?
  - Formulario en UI → `POST/PUT` a API → validación → BD → navegación y recarga de lista.
- ¿Qué llevaría a producción?
  - Autenticación, paginación, control de errores detallado, seguridad (helmet, rate limiting), observabilidad, despliegue en Atlas.

## Ejemplos de Requests/Responses

### Crear Animal
```
POST /animals
Content-Type: application/json

{
  "name": "Nina",
  "species": "Dog",
  "age": 4,
  "shelterId": "64f1c2a4e5b8c3a1d2f0a9b7",
  "description": "Muy juguetona"
}
```
Respuesta
```
201 Created
{
  "ok": true,
  "data": {
    "_id": "65a1...",
    "name": "Nina",
    "species": "Dog",
    "age": 4,
    "shelterId": "64f1...",
    "description": "Muy juguetona"
  }
}
```

### Búsqueda
```
GET /animals/search?q=Dog
```
Respuesta
```
200 OK
{ "ok": true, "data": [ /* animales que coinciden */ ] }
```

## Referencias de Código
- Conexión y arranque: `server/src/server.js:57`
- Salud API: `server/src/server.js:21`
- Fallback Mongo memoria: `server/src/server.js:66`
- Seeding automático: `server/src/server.js:33`
- Modelos: `server/src/models/Animal.js:3`, `server/src/models/Shelter.js:3`
- Routers:
  - Animales: `server/src/routes/animals.js:16`, `server/src/routes/animals.js:55`, `server/src/routes/animals.js:95`
  - Shelters: `server/src/routes/shelters.js:14`, `server/src/routes/shelters.js:39`, `server/src/routes/shelters.js:72`
- Frontend:
  - Montaje y rutas: `client/src/main.tsx:9`, `client/src/App.tsx:21`
  - Cliente HTTP y tipos: `client/src/api.ts:3`, `client/src/api.ts:10`, `client/src/api.ts:19`
  - Páginas: `client/src/pages/Home.tsx:12`, `client/src/pages/AnimalDetails.tsx:6`, `client/src/pages/Shelters.tsx:29`

