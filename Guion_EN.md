# PetRescue — Presentation Guide (English)

## Project Summary
- Full‑stack app to manage animals and shelters.
- Frontend: React + Vite + TypeScript (`client/`), Backend: Node.js + Express + Mongoose (`server/`).
- MongoDB persistence; when local DB is not available, the API falls back to an in‑memory Mongo instance using `mongodb-memory-server`.
- REST API with `animals` and `shelters` resources, `Joi` input validation, CORS enabled, request logging via `morgan`.

## Architecture
- Layers:
  - UI (React) → `axios` → API (Express) → Mongoose → MongoDB.
- DB connection:
  - Tries `MONGO_URI` (`mongodb://127.0.0.1:27017/petrescue` by default). If it fails, starts an in‑memory Mongo.
- Communication:
  - `axios` consumes the API with base `VITE_API_BASE` (defaults to `http://localhost:4000`).

```
[React UI] --HTTP--> [Express API] --ODM--> [Mongoose] --wire--> [MongoDB | In-Memory]
```

## Technologies
- Backend: `express`, `mongoose`, `joi`, `cors`, `morgan`, `mongodb-memory-server`.
- Frontend: `react`, `react-router-dom`, `axios`, `@vitejs/plugin-react`, TypeScript, ESLint.

## Directory Structure
- `client/` (frontend)
  - `src/`: `App.tsx`, `pages/`, `api.ts`, styles.
  - `public/`: static assets.
  - Config: `vite.config.ts`, `eslint.config.js`, `tsconfig*`, `package.json`.
- `server/` (backend)
  - `src/server.js`: boot and server configuration.
  - `src/models/`: `Animal.js`, `Shelter.js` schemas.
  - `src/routes/`: `animals.js`, `shelters.js` routers.
  - `src/seed.js`: seeding script.
  - `package.json`: scripts and dependencies.

## Backend (API)
- Server & middleware
  - JSON body parsing, CORS, and request logging.
  - Health endpoint `GET /`: service name + animals count.
  - References: `server/src/server.js:17`, `server/src/server.js:18`, `server/src/server.js:19`, `server/src/server.js:21`.
- DB connection
  - Tries `MONGO_URI`; if it fails, creates an in‑memory Mongo and connects.
  - References: `server/src/server.js:60`, `server/src/server.js:66`, `server/src/server.js:69`.
- Seeding
  - `ensureSeed()` inserts 5 shelters and 5 animals when collections are below threshold.
  - Manual script: `node src/seed.js`.
  - References: `server/src/server.js:33`, `server/src/seed.js:8`.
- Validation & errors
  - `Joi` validates `POST/PUT` payloads.
  - `ObjectId` validation on `/:id` routes.
  - Central error handler returns generic 500.
  - References: `server/src/routes/animals.js:57`, `server/src/routes/shelters.js:41`, `server/src/server.js:29`.

### Endpoints

| Resource   | Method | Path                      | Description                                   |
|------------|--------|---------------------------|-----------------------------------------------|
| Animals    | GET    | `/animals`                | List all                                       |
| Animals    | GET    | `/animals/:id`            | Get by id                                      |
| Animals    | GET    | `/animals/search?q=...`   | Text search (indexed)                          |
| Animals    | POST   | `/animals`                | Create (casts `shelterId` to `ObjectId`)       |
| Animals    | PUT    | `/animals/:id`            | Update                                         |
| Animals    | DELETE | `/animals/:id`            | Delete                                         |
| Shelters   | GET    | `/shelters`               | List all                                       |
| Shelters   | GET    | `/shelters/:id`           | Get by id                                      |
| Shelters   | POST   | `/shelters`               | Create                                         |
| Shelters   | PUT    | `/shelters/:id`           | Update                                         |
| Shelters   | DELETE | `/shelters/:id`           | Delete                                         |

References: `server/src/routes/animals.js:16`, `server/src/routes/animals.js:25`, `server/src/routes/animals.js:41`, `server/src/routes/animals.js:55`, `server/src/routes/animals.js:71`, `server/src/routes/animals.js:95`, `server/src/routes/shelters.js:14`, `server/src/routes/shelters.js:23`, `server/src/routes/shelters.js:39`, `server/src/routes/shelters.js:52`, `server/src/routes/shelters.js:72`.

## Data Models

### Animal
- Fields: `name`, `species`, `age`, `shelterId` (ref `Shelter`), `description`.
- Text index on `name` and `description` for efficient search.
- Reference: `server/src/models/Animal.js:3`, `server/src/models/Animal.js:14`.

### Shelter
- Fields: `name`, `address`, `capacity`.
- Reference: `server/src/models/Shelter.js:3`.

## Frontend (UI)
- Entry & routes
  - Mounted with `BrowserRouter`.
  - Routes: `/`, `/animals/new`, `/animals/:id`, `/animals/:id/edit`, `/shelters`.
  - References: `client/src/main.tsx:9`, `client/src/App.tsx:21`.
- API client
  - `axios` instance with configurable `baseURL` (`VITE_API_BASE`).
  - TS types `Animal` and `Shelter` share shapes with the API.
  - References: `client/src/api.ts:3`, `client/src/api.ts:5`, `client/src/api.ts:10`, `client/src/api.ts:19`.
- Pages
  - `Home.tsx`: list + search; navigates to detail on card click.
  - `AnimalDetails.tsx`: `view/edit/create` modes, `POST/PUT` save, `DELETE` remove, loads associated shelter.
  - `Shelters.tsx`: full CRUD with inline editing and reload after operations.
  - References: `client/src/pages/Home.tsx:12`, `client/src/pages/Home.tsx:46`, `client/src/pages/AnimalDetails.tsx:6`, `client/src/pages/AnimalDetails.tsx:33`, `client/src/pages/AnimalDetails.tsx:43`, `client/src/pages/AnimalDetails.tsx:64`, `client/src/pages/AnimalDetails.tsx:78`, `client/src/pages/Shelters.tsx:29`, `client/src/pages/Shelters.tsx:35`, `client/src/pages/Shelters.tsx:41`.

## Data Flows
- Search animals
  - User types and clicks “Search”; UI calls `/animals/search?q=...` and renders cards.
- View detail
  - Clicking a card → `/animals/:id`; shows animal info and shelter; actions “Edit” and “Delete”.
- Create/edit animal
  - “New” → form with shelters; save creates via `POST`. In edit mode, `PUT`; delete via `DELETE`.
- Shelters CRUD
  - Create in the top form; in the list, “Edit” opens inline; “Delete” removes and reloads.

### Sequence Diagram (Create Animal)
```
User -> UI(Home): Click "New"
UI -> UI(AnimalDetails create): Render form + load shelters
UI -> API: POST /animals { name, species, age, shelterId, description }
API -> DB(Mongo): insert Animal (Joi validates, shelterId -> ObjectId)
DB -> API: ok (201)
API -> UI: ok
UI -> Router: navigate "/"
UI(Home) -> API: GET /animals
UI(Home): render updated list
```

## How to Run
- Environment variables
  - Backend: `MONGO_URI`, `PORT`, `CLIENT_ORIGIN`.
  - Frontend: `VITE_API_BASE`.
- Start
  - Backend (`server/`): `npm run start` → `http://localhost:4000`
  - Frontend (`client/`): `npm run dev` → `http://localhost:5173`
- Seeding
  - Automatic when collections are below threshold.
  - Manual: `node src/seed.js` in `server/`.

## Demo Script
- Start backend and verify: `Server listening on http://localhost:4000` (`server/src/server.js:71`).
- Start frontend and open `http://localhost:5173`.
- Try:
  - Home: list and search “Dog” or “Cat”.
  - Detail: edit and delete an animal.
  - Create animal: select shelter and save.
  - Shelters: create, inline edit, delete.
- Quick API checks:
  - `GET http://localhost:4000/animals`
  - `GET http://localhost:4000/animals/search?q=Bella`
  - `POST http://localhost:4000/animals` with valid JSON.

## Design Decisions
- In‑memory Mongo fallback for demos/CI without local installation.
+- `Joi` for robust validation at the API boundary.
+- Text index on `Animal` for efficient search.
+- `.lean()` in queries for lighter responses.
+- Clear separation of models/routers and shared TS types in the frontend.

## Security & Best Practices
- CORS controlled via `CLIENT_ORIGIN` to restrict frontend origins.
- `ObjectId` validation prevents invalid inputs.
- No secrets committed; use environment variables.
- Logging with `morgan` in `dev` format for basic observability.
- Production suggestions: rate limiting, `helmet`, relation validation (`shelterId` exists), authentication.

## Future Improvements
- Authentication & roles (admin/user).
- Pagination and advanced filters (species, age, shelter).
- Image upload & storage.
- Unit/integration tests for validation and routes.
- Detailed error handling in the UI (toasts/alerts).
- Enforce real persistence (avoid memory fallback in prod).

## Troubleshooting
- CORS blocked: adjust `CLIENT_ORIGIN` and `VITE_API_BASE`.
- Mongo unavailable: in‑memory fallback is used; for persistence, set `MONGO_URI`.
- Invalid IDs: API returns 400 “Invalid id”.
- Build/lint:
  - Frontend: `npm run build`, `npm run lint`.
  - Backend: add ESLint/Prettier as needed.

## Typical Questions & Answers
- Why `mongodb-memory-server`?
  - To run and demo without installing Mongo; great for CI. Data does not persist across restarts.
- How is input validated?
  - `Joi` in `POST/PUT` and `ObjectId` checks on `/:id` routes.
- What is the create/edit flow?
  - UI form → `POST/PUT` → validation → DB → navigate and reload list.
- What would you do for production?
  - Authentication, pagination, detailed error handling, security hardening, observability, deploy on Atlas.

## Request/Response Examples

### Create Animal
```
POST /animals
Content-Type: application/json

{
  "name": "Nina",
  "species": "Dog",
  "age": 4,
  "shelterId": "64f1c2a4e5b8c3a1d2f0a9b7",
  "description": "Very playful"
}
```
Response
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
    "description": "Very playful"
  }
}
```

### Search
```
GET /animals/search?q=Dog
```
Response
```
200 OK
{ "ok": true, "data": [ /* matching animals */ ] }
```

## Code References
- Boot & start: `server/src/server.js:57`
- Health: `server/src/server.js:21`
- In‑memory fallback: `server/src/server.js:66`
- Automatic seeding: `server/src/server.js:33`
- Models: `server/src/models/Animal.js:3`, `server/src/models/Shelter.js:3`
- Routers:
  - Animals: `server/src/routes/animals.js:16`, `server/src/routes/animals.js:55`, `server/src/routes/animals.js:95`
  - Shelters: `server/src/routes/shelters.js:14`, `server/src/routes/shelters.js:39`, `server/src/routes/shelters.js:72`
- Frontend:
  - Mount & routes: `client/src/main.tsx:9`, `client/src/App.tsx:21`
  - HTTP client & types: `client/src/api.ts:3`, `client/src/api.ts:10`, `client/src/api.ts:19`
  - Pages: `client/src/pages/Home.tsx:12`, `client/src/pages/AnimalDetails.tsx:6`, `client/src/pages/Shelters.tsx:29`

---

# Appendix — Material adicional (EN/ES)

## Deployment Options / Opciones de despliegue
- EN: Local MongoDB (`MONGO_URI`), Dockerized Mongo, or MongoDB Atlas. Set `MONGO_URI` accordingly and keep `CLIENT_ORIGIN` aligned with your frontend domain.
- ES: MongoDB local (`MONGO_URI`), Mongo dockerizado o MongoDB Atlas. Configura `MONGO_URI` y asegúrate de `CLIENT_ORIGIN` coincidir con el dominio del frontend.

## Environment Examples / Ejemplos de entorno
- EN:
  - Backend `.env`: `MONGO_URI=mongodb://127.0.0.1:27017/petrescue`, `PORT=4000`, `CLIENT_ORIGIN=http://localhost:5173`
  - Frontend `.env`: `VITE_API_BASE=http://localhost:4000`
- ES:
  - Backend `.env`: `MONGO_URI=mongodb://127.0.0.1:27017/petrescue`, `PORT=4000`, `CLIENT_ORIGIN=http://localhost:5173`
  - Frontend `.env`: `VITE_API_BASE=http://localhost:4000`

## Testing Strategy / Estrategia de pruebas
- EN: Unit tests for routers and validation, integration tests against in‑memory Mongo, and UI tests for critical flows (search, create, edit, delete).
- ES: Pruebas unitarias de routers y validación, integración contra Mongo en memoria, y pruebas de UI para flujos críticos (buscar, crear, editar, eliminar).

## Performance Considerations / Consideraciones de rendimiento
- EN: Use pagination for large lists, index common filters (e.g., species), and avoid heavy payloads; prefer `.lean()` for read endpoints.
- ES: Usar paginación en listas grandes, indexar filtros comunes (p. ej., `species`), evitar cargas pesadas; preferir `.lean()` en endpoints de lectura.

