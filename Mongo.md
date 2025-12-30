# MongoDB — Funcionamiento en el Proyecto PetRescue

## Objetivo
- Explicar de forma completa cómo se usa MongoDB en el backend del proyecto.
- Cubrir conexión, modelos, validación, índices/búsquedas, CRUD, seeding y buenas prácticas.

## Conexión y Configuración
- Conexión con Mongoose:
  - Se conecta a `MONGO_URI` (por defecto `mongodb://127.0.0.1:27017/petrescue`).
  - Requiere una instancia de MongoDB ejecutándose localmente o en la URI especificada.
  - Referencias: [server.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/server.js#L57-L74).
- Variables de entorno relevantes:
  - `MONGO_URI`: URI de Mongo (local/Atlas).
  - `PORT`: puerto del servidor Express (por defecto 4000).
  - `CLIENT_ORIGIN`: origen permitido para CORS (por defecto `http://localhost:5173`). [server.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/server.js#L13-L19)
- Estado del servicio:
  - `GET /` devuelve el conteo de animales como verificación básica. [server.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/server.js#L21-L24)

## Modelado de Datos (Mongoose)
- Animal:
  - Campos: `name`, `species`, `age`, `shelterId` (ref a `Shelter`), `description`.
  - Índice de texto en `name` y `description` para búsquedas. [Animal.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/models/Animal.js#L3-L16) índice [Animal.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/models/Animal.js#L14)
- Shelter:
  - Campos: `name`, `address`, `capacity`. [Shelter.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/models/Shelter.js#L3-L10)
- Relaciones:
  - `Animal.shelterId` almacena un `ObjectId` que referencia a la colección `shelters`. La consistencia referencial se maneja a nivel de aplicación (no hay foreign key en MongoDB).

## Validación y Conversión de Tipos
- Validación con `Joi` en `POST/PUT` para `animals` y `shelters`. [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L8-L14), [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L8-L12)
- Validación de `ObjectId` en rutas con `/:id`. [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L28-L31), [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L26-L28)
- Conversión explícita de `shelterId` a `ObjectId` al crear/editar animales. [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L61-L65), [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L81-L85)

## Índices y Búsqueda
- Índice de texto en `Animal`:
  - Permite búsquedas con `$text` sobre `name` y `description`. [Animal.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/models/Animal.js#L14)
- Endpoint de búsqueda:
  - `GET /animals/search?q=...` usa `$text: { $search: q }`. [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L41-L49)
- Notas de rendimiento:
  - Las lecturas usan `.lean()` para respuestas más ligeras. [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L18), [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L16)

## CRUD de la API (sobre MongoDB)
- Animales:
  - Listar: `GET /animals` → `Animal.find().lean()` [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L16-L23)
  - Detalle: `GET /animals/:id` → `Animal.findById(id).lean()` [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L25-L39)
  - Buscar: `GET /animals/search?q=...` → `$text` [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L41-L49)
  - Crear: `POST /animals` → `Animal.create(value)` [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L55-L66)
  - Actualizar: `PUT /animals/:id` → `findByIdAndUpdate(..., { new: true }).lean()` [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L71-L90)
  - Eliminar: `DELETE /animals/:id` → `findByIdAndDelete(id).lean()` [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L95-L106)
- Refugios:
  - Listar: `GET /shelters` → `Shelter.find().lean()` [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L14-L21)
  - Detalle: `GET /shelters/:id` → `Shelter.findById(id).lean()` [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L23-L37)
  - Crear: `POST /shelters` → `Shelter.create(value)` [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L39-L47)
  - Actualizar: `PUT /shelters/:id` → `findByIdAndUpdate(..., { new: true }).lean()` [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L52-L67)
  - Eliminar: `DELETE /shelters/:id` → `findByIdAndDelete(id).lean()` [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L72-L82)

## Seeding (Datos de Ejemplo)
- Automático al arrancar:
  - `ensureSeed()` revisa el conteo y, si hay menos de 5, inserta 5 `shelters` y 5 `animals`. [server.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/server.js#L33-L55)
- Script manual:
  - `node src/seed.js` limpia colecciones e inserta los mismos datos. [seed.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/seed.js#L7-L33)

## Manejo de Errores
- Middleware de errores centralizado devuelve `500` genérico si algo falla. [server.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/server.js#L29-L31)
- Errores de validación:
  - `Joi` responde `400` con lista de mensajes. [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L57-L60), [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L41-L44)
- IDs inválidos:
  - Respuestas `400 "Invalid id"` cuando el `ObjectId` no es válido. [animals.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/animals.js#L28-L31), [shelters.js](file:///c:/Users/javie/Documents/trae_projects/Final_ADS/server/src/routes/shelters.js#L26-L28)

## Entornos y Persistencia
- Requisito:
  - Es necesario tener MongoDB instalado y ejecutándose localmente (o tener acceso a un cluster Atlas).
  - La persistencia está garantizada por la instancia de MongoDB.

## Ejemplos de Consultas (Mongoose)

### Listar animales
```js
// server/src/routes/animals.js
const animals = await Animal.find().lean();
```

### Búsqueda textual
```js
// server/src/routes/animals.js
const animals = await Animal.find({ $text: { $search: q } }).lean();
```

### Crear animal (conversión de shelterId)
```js
// server/src/routes/animals.js
const doc = await Animal.create({
  ...value,
  shelterId: new mongoose.Types.ObjectId(value.shelterId)
});
```

### Actualizar animal
```js
// server/src/routes/animals.js
const updated = await Animal.findByIdAndUpdate(
  id,
  { ...value, shelterId: new mongoose.Types.ObjectId(value.shelterId) },
  { new: true }
).lean();
```

## Buenas Prácticas y Mejoras
- Validación referencial:
  - Antes de crear/editar `Animal`, comprobar que el `shelterId` exista (`Shelter.findById`).
- Paginación y límites:
  - Añadir `limit`, `skip` y `sort` a listados/búsquedas para respuestas eficientes.
- Índices adicionales:
  - Indexar campos de filtro frecuente (por ejemplo `species`, `age`).
- Seguridad y robustez:
  - Usar `helmet`, rate limiting y logs estructurados en producción.
- Observabilidad:
  - Añadir métricas y trazas si se requiere diagnóstico avanzado.

## Conclusión
- El proyecto implementa el método estándar de uso de MongoDB/Mongoose para una API REST: conexión configurable, modelos claros, validación con `Joi`, CRUD completo, búsqueda textual e inserción de datos de ejemplo.
- Las optimizaciones recomendadas (paginación, más índices, validación referencial estricta) se pueden añadir para alinearlo al 100% con guías avanzadas de rendimiento y diseño.

