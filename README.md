# Los Juegos de Expressive English Academy

Videojuego educativo arcade/shooter hecho con React + Firebase para reforzar inglés desde vocabulario básico hasta gramática avanzada. Está pensado para clase, móvil, desktop y proyector, con interfaz en español y ejercicios en inglés.

## Qué incluye

- 16 niveles progresivos con 10 preguntas por nivel
- Juego arcade con héroe, disparos, enemigos, HUD y boss final
- Preguntas con banco fijo amplio + plantillas dinámicas
- Dificultad adaptable según desempeño
- Modo práctica y modo torneo
- Power-ups, estrellas, badges y celebración final
- Leaderboard online con Firebase o fallback mock local
- Guardado de progreso por estudiante
- Audio generado con Web Audio API y lectura opcional con Web Speech API
- Diseño responsive listo para desktop, celular y proyector

## Stack

- React 18
- Vite 5
- Firebase Auth anónima + Firestore
- CSS modular simple sin dependencias pesadas

## Estructura del proyecto

```text
.
├─ public/
│  └─ logo-placeholder.svg
├─ src/
│  ├─ components/
│  │  ├─ game/
│  │  ├─ layout/
│  │  ├─ screens/
│  │  └─ ui/
│  ├─ content/
│  │  └─ academyContent.js
│  ├─ data/
│  │  ├─ badges.js
│  │  └─ mockLeaderboard.js
│  ├─ hooks/
│  │  ├─ useAdaptiveDifficulty.js
│  │  ├─ useAppController.js
│  │  ├─ useAudioEngine.js
│  │  └─ useSpeech.js
│  ├─ services/
│  │  ├─ firebase.js
│  │  ├─ gameService.js
│  │  └─ localDb.js
│  ├─ styles/
│  │  └─ global.css
│  ├─ utils/
│  │  ├─ format.js
│  │  └─ random.js
│  ├─ App.jsx
│  └─ main.jsx
├─ .env.example
├─ firebase.json
├─ firestore.rules
├─ package.json
└─ vite.config.js
```

## Cómo correr localmente

Requisito previo: instalar Node.js 18 o superior.

1. Instala dependencias:

```bash
npm install
```

2. Copia `.env.example` a `.env` y agrega tus variables de Firebase si ya las tienes.

3. Inicia el proyecto:

```bash
npm run dev
```

4. Abre `http://localhost:5173`.

## Cómo desplegar gratis

### Opción 1: Vercel

1. Sube el proyecto a GitHub.
2. Crea un proyecto en Vercel.
3. Importa el repositorio.
4. Agrega las variables `VITE_FIREBASE_*`.
5. Build command: `npm run build`
6. Output directory: `dist`

### Opción 2: Firebase Hosting

1. Instala CLI:

```bash
npm install -g firebase-tools
firebase login
```

2. Construye la app:

```bash
npm run build
```

3. Inicializa hosting si hace falta:

```bash
firebase init hosting
```

4. Despliega:

```bash
firebase deploy
```

El archivo [`firebase.json`](/C:/Users/andre/OneDrive/Desktop/New%20folder/firebase.json) ya está preparado para SPA.

## Configuración Firebase

El proyecto usa:

- `players`: datos mínimos del estudiante
- `progress`: progreso, niveles desbloqueados, score, estrellas y badges
- `leaderboard`: ranking global

Variables necesarias en `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

Si Firebase no está configurado, la app funciona con mock local usando `localStorage`.

## Cómo reemplazar el logo

1. Reemplaza [`public/logo-placeholder.svg`](/C:/Users/andre/OneDrive/Desktop/New%20folder/public/logo-placeholder.svg) por tu logo.
2. Mantén el mismo nombre o actualiza la ruta en [`src/components/ui/LogoBadge.jsx`](/C:/Users/andre/OneDrive/Desktop/New%20folder/src/components/ui/LogoBadge.jsx).
3. El logo aparece en:
   - pantalla principal
   - leaderboard
   - game over
   - victoria y celebración

## Cómo cambiar colores

Edita las variables CSS en [`src/styles/global.css`](/C:/Users/andre/OneDrive/Desktop/New%20folder/src/styles/global.css):

- `--blue`
- `--cyan`
- `--gold`
- `--bg-card`
- `--text`

## Cómo agregar más niveles

1. Agrega la definición del nivel en [`src/content/academyContent.js`](/C:/Users/andre/OneDrive/Desktop/New%20folder/src/content/academyContent.js) dentro de `levelDefinitions`.
2. Crea o reutiliza un generador en `generators`.
3. Ajusta los textos o boss si quieres una progresión distinta.

## Cómo funciona cada módulo

### `src/hooks/useAppController.js`

Controla navegación, sesión de juego, loop arcade, score, preguntas, boss, power-ups, guardado y leaderboard.

### `src/content/academyContent.js`

Contiene los niveles, bancos de vocabulario y plantillas dinámicas de preguntas en inglés.

### `src/hooks/useAdaptiveDifficulty.js`

Calcula dificultad en tiempo real según aciertos, errores y racha del estudiante.

### `src/services/firebase.js`

Inicializa Firebase, Auth anónima y operaciones en Firestore.

### `src/services/gameService.js`

Decide si usar Firebase o fallback local y unifica registro, progreso y ranking.

### `src/components/screens/*`

Implementa todas las pantallas: carga, inicio, registro, niveles, juego, leaderboard, perfil, victoria, game over y celebración final.

## Contenido académico

Niveles incluidos:

1. Colors
2. Numbers
3. Fruits
4. Animals
5. School Objects
6. Verb To Be
7. Personal Pronouns
8. Simple Present
9. Present Continuous
10. Past Simple
11. Past Continuous
12. Past Participle
13. Present Perfect
14. Past Perfect
15. Mixed Review
16. Final Academy Challenge

La generación mezcla:

- bancos fijos de opciones
- plantillas dinámicas con variables
- distractores aleatorios

Así se evita la repetición exacta excesiva.

## Notas pedagógicas

- La interfaz está en español.
- El contenido académico y respuestas están en inglés.
- Hay ayudas visuales y hints en dificultad baja.
- El audio de lectura es manual, nunca forzado.

## Mejoras futuras recomendadas

- panel admin para editar preguntas desde Firestore
- arte ilustrado propio del héroe y bosses
- sonidos/loops musicales externos premium
- analytics por grupo o por docente
- validación más fuerte con Cloud Functions para leaderboard

## Estado del proyecto

El proyecto quedó preparado para ser desplegado gratis y funcionar aun sin Firebase conectado. Si quieres endurecer seguridad del leaderboard, la siguiente mejora ideal es mover la escritura de score a Cloud Functions con validación del lado servidor.
