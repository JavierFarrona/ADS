# PetRescue — Guía de descarga e instalación

## Descripción
Aplicación full‑stack para gestionar animales y refugios. Frontend React + Vite + TypeScript (`client/`), backend Node.js + Express + Mongoose (`server/`). Base de datos MongoDB.

## Requisitos
- Node.js 18+ y npm
- MongoDB local (o Atlas).

## Descarga del proyecto
```bash
git clone https://github.com/JavierFarrona/ADS.git
cd ADS
```

## Instalación de dependencias
- Backend:
  ```bash
  cd server
  npm install
  ```
- Frontend:
  ```bash
  cd ../client
  npm install
  ```

## Variables de entorno
- Backend (`server`): crear `.env` (opcional)
  ```env
  MONGO_URI=mongodb://127.0.0.1:27017/petrescue
  PORT=4000
  CLIENT_ORIGIN=http://localhost:5173
  ```
- Frontend (`client`): crear `.env` (opcional)
  ```env
  VITE_API_BASE=http://localhost:4000
  ```

## Ejecución en desarrollo
Abre dos terminales:
- Terminal 1 (backend):
  ```bash
  cd server
  npm run start
  # Servidor en http://localhost:4000
  ```
- Terminal 2 (frontend):
  ```bash
  cd client
  npm run dev
  # Frontend en http://localhost:5173
  ```

## Semilla de datos
- Automática: al arrancar, si hay pocos registros, se insertan refugios y animales de ejemplo.
- Manual:
  ```bash
  cd server
  node src/seed.js
  ```

## Endpoints principales (API)
- Animales:
  - `GET /animals`
  - `GET /animals/:id`
  - `GET /animals/search?q=...`
  - `POST /animals`
  - `PUT /animals/:id`
  - `DELETE /animals/:id`
- Refugios:
  - `GET /shelters`
  - `GET /shelters/:id`
  - `POST /shelters`
  - `PUT /shelters/:id`
  - `DELETE /shelters/:id`

## Scripts útiles
- Frontend:
  - `npm run dev` — servidor de desarrollo Vite
  - `npm run build` — build de producción (TypeScript + Vite)
  - `npm run lint` — lint del proyecto
  - `npm run preview` — previsualizar build en local
- Backend:
  - `npm run start` — arranque del servidor Express
  - `npm run seed` — ejecutar script de semilla

## Troubleshooting
- Error de CORS: ajusta `CLIENT_ORIGIN` en backend y `VITE_API_BASE` en frontend para que coincidan con tus dominios.
- Mongo no disponible: asegura que tu instancia de MongoDB esté corriendo.
- IDs inválidos: la API devuelve 400 “Invalid id” si el formato no es correcto.
- Puertos: por defecto `4000` backend y `5173` frontend; puedes cambiarlos en `.env` o configuración.

## Licencia
Proyecto educativo. Ajusta y reutiliza libremente según tus necesidades.
