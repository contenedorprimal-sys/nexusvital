# ⚡ NexusVital — Plataforma de Salud y Bienestar

## 🏋️ Descripción

NexusVital es una plataforma web integral de salud y bienestar construida con el stack MERN (MongoDB, Express.js, React, Node.js). Permite a los usuarios registrar y dar seguimiento a sus actividades de ejercicio, dieta, meditación y mindfulness, con un sistema de gamificación que incluye niveles y XP.

## 🚀 Características

- ✅ **Registro y autenticación** con JWT y cookies httpOnly
- ✅ **Dashboard interactivo** con progreso diario, semanal y mensual
- ✅ **Sistema de niveles** (Cobre → Plata → Oro → Platino) con XP por actividad
- ✅ **4 categorías de bienestar**: Ejercicio, Dieta, Meditación, Mindfulness
- ✅ **IA de recomendaciones** personalizadas basadas en perfil y rendimiento
- ✅ **Suscripción Premium** (simulada) con 3 niveles: Gratuito, Mensual, Anual
- ✅ **Recursos de YouTube** curados para ejercicios, meditación y nutrición
- ✅ **Tienda Fitness** (simulada) con temática gamer
- ✅ **Panel de Administración** para gestión de usuarios
- ✅ **Política de Privacidad** y gestión de cookies
- ✅ **Diseño responsive** con sidebar en desktop y menú en móvil

## 📁 Estructura del Proyecto

```
nexusvital/
├── server/          # Backend (Express + MongoDB)
│   ├── config/      # Configuración de DB
│   ├── controllers/ # Controladores de la API
│   ├── middleware/   # Auth, Admin, Error Handler
│   ├── models/      # Modelos de Mongoose
│   ├── routes/      # Rutas de la API
│   ├── utils/       # Utilidades (Niveles, IA, Análisis)
│   └── server.js    # Punto de entrada
├── client/          # Frontend (React + Vite)
│   └── src/
│       ├── components/  # Componentes React
│       ├── context/     # Context providers
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Páginas de la app
│       ├── services/    # Capa de API
│       ├── styles/      # Hojas de estilo CSS
│       └── utils/       # Utilidades
└── README.md
```

## 🛠️ Instalación

### Requisitos previos
- Node.js 18+
- MongoDB (local o Atlas)

### Backend
```bash
cd server
cp .env.example .env   # Configurar variables de entorno
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📊 Niveles de Progreso

| Nivel | XP Requerido | Tier |
|-------|-------------|------|
| 🥉 Cobre | 0 - 499 | Principiante |
| 🥈 Plata | 500 - 1,499 | Medio |
| 🥇 Oro | 1,500 - 3,499 | Avanzado |
| 💎 Platino | 3,500+ | Pro |

## 💳 Planes de Suscripción

| Característica | Gratuito | Mensual | Anual |
|---|:---:|:---:|:---:|
| Seguimiento de actividades | ✅ | ✅ | ✅ |
| Historial semanal | ✅ | ✅ | ✅ |
| 1 tarea personalizada | ✅ | ✅ | ✅ |
| Tareas ilimitadas | ❌ | ✅ | ✅ |
| Historial mensual | ❌ | ✅ | ✅ |
| Análisis de tendencias | ❌ | ✅ | ✅ |
| Dashboard personalizable | ❌ | ✅ | ✅ |
| Detección de estancamiento | ❌ | ❌ | ✅ |
| Análisis sueño/fatiga | ❌ | ❌ | ✅ |
| Tienda fitness | ❌ | ✅ | ✅ |

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (12 rounds)
- JWT almacenados en cookies httpOnly
- Rate limiting en endpoints de autenticación
- CORS configurado para orígenes permitidos
- Validación de entrada con express-validator

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Perfil del usuario actual

### Actividades
- `GET /api/activities` - Listar actividades
- `POST /api/activities` - Crear actividad
- `PUT /api/activities/:id` - Actualizar actividad
- `DELETE /api/activities/:id` - Eliminar actividad

### Progreso
- `GET /api/progress/weekly` - Progreso semanal
- `GET /api/progress/monthly` - Progreso mensual (premium)
- `GET /api/progress/trends` - Tendencias (premium anual)

### IA
- `GET /api/ai/recommendations` - Recomendaciones personalizadas
- `GET /api/ai/daily-suggestion` - Sugerencia del día

## 📄 Licencia

MIT © NexusVital
