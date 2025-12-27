# PetRescue — Chuleta / Cheat Sheet

## Stack
- Client: React + Vite + TypeScript (`client/`)
- Server: Node.js + Express + Mongoose (`server/`)
- DB: MongoDB (fallback `mongodb-memory-server`)

## Arranque / Start
- Backend: `cd server && npm run start` → `http://localhost:4000`
- Frontend: `cd client && npm run dev` → `http://localhost:5173`
- Seed manual: `cd server && node src/seed.js`

## Entorno / Env
- Backend: `MONGO_URI`, `PORT`, `CLIENT_ORIGIN` (`server/src/server.js:13-17`)
- Frontend: `VITE_API_BASE` (`client/src/api.ts:3`)

## API Endpoints
- Animals:
  - `GET /animals` (`server/src/routes/animals.js:16`)
  - `GET /animals/:id` (`server/src/routes/animals.js:25`)
  - `GET /animals/search?q=...` (`server/src/routes/animals.js:41`)
  - `POST /animals` (`server/src/routes/animals.js:55`)
  - `PUT /animals/:id` (`server/src/routes/animals.js:71`)
  - `DELETE /animals/:id` (`server/src/routes/animals.js:95`)
- Shelters:
  - `GET /shelters` (`server/src/routes/shelters.js:14`)
  - `GET /shelters/:id` (`server/src/routes/shelters.js:23`)
  - `POST /shelters` (`server/src/routes/shelters.js:39`)
  - `PUT /shelters/:id` (`server/src/routes/shelters.js:52`)
  - `DELETE /shelters/:id` (`server/src/routes/shelters.js:72`)

## Payload Ejemplo / Sample Payload
```
POST /animals
Content-Type: application/json
{
  "name": "Nina",
  "species": "Dog",
  "age": 4,
  "shelterId": "<24-char ObjectId>",
  "description": "Muy juguetona / Very playful"
}
```

## Flujos Rápidos / Quick Flows
- Buscar: UI → `GET /animals/search?q=...` → render lista
- Detalle: Click card → `/animals/:id` → acciones Edit/Delete
- Crear/Editar: Form → `POST/PUT /animals` → navegar Home
- Shelters: Crear, editar inline, eliminar → recargar lista

## Diseño / Design
- Fallback Mongo en memoria si falla `MONGO_URI` (`server/src/server.js:66-69`)
- Validación `Joi` y `ObjectId` en rutas (`animals.js` / `shelters.js`)
- Índice texto en `Animal` (`server/src/models/Animal.js:14`)
- `.lean()` para respuestas ligeras

## Troubleshooting
- CORS: ajustar `CLIENT_ORIGIN` y `VITE_API_BASE`
- Mongo: memoria automática; para persistencia, definir `MONGO_URI`
- IDs inválidos: 400 “Invalid id”

## Referencias Clave / Key References
- Server boot: `server/src/server.js:57`
- Salud: `server/src/server.js:21`
- Seed auto: `server/src/server.js:33`
- Modelos: `server/src/models/Animal.js:3`, `server/src/models/Shelter.js:3`
- Frontend rutas: `client/src/App.tsx:21`, montaje `client/src/main.tsx:9`
- Cliente HTTP: `client/src/api.ts:3,5,10,19`

## Mejoras / Improvements
- Auth & roles, paginación/filtros, subida de imágenes
- Tests (unit/integration), errores detallados en UI, seguridad (`helmet`, rate limiting)

---

## English Quick Card
- Stack: React + Vite + TS (client) / Express + Mongoose (server) / MongoDB
- Start: `server: npm run start` (`http://localhost:4000`) • `client: npm run dev` (`http://localhost:5173`)
- Env: Backend `MONGO_URI`, `PORT`, `CLIENT_ORIGIN` • Frontend `VITE_API_BASE`
- Endpoints:
  - Animals: `GET /animals`, `GET /animals/:id`, `GET /animals/search?q=...`, `POST /animals`, `PUT /animals/:id`, `DELETE /animals/:id`
  - Shelters: `GET /shelters`, `GET /shelters/:id`, `POST /shelters`, `PUT /shelters/:id`, `DELETE /shelters/:id`
- Sample create:
```
POST /animals { name, species, age, shelterId, description }
```
- Flows: Search → List • View → Edit/Delete • Create/Edit → Save & back Home • Shelters CRUD
- Design: In‑memory fallback, `Joi` validation, text index, `.lean()`
- Troubleshoot: CORS origins, define `MONGO_URI`, handle invalid IDs
- Code refs: Server `server/src/server.js:21,33,57,66` • Models `Animal.js:3,14`, `Shelter.js:3` • Frontend `App.tsx:21`, `main.tsx:9`, `api.ts:3`

