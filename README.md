# To-Do List Backend

API backend para una aplicación de lista de tareas (To-Do List) usando Node.js, TypeScript, Prisma y JWT.

## Requisitos
- Node.js >= 18
- npm >= 9
- Base de datos MySQL (puedes usar un servicio local o en la nube)
- AWS CLI (opcional, solo si vas a desplegar en AWS)

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/IsaacNavarro-0206/to-do-list-backend.git
   cd to-do-list-backend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz del proyecto:
     ```env
     JWT_SECRET=tu-secreto-super-seguro
     DATABASE_URL=mysql://usuario:contraseña@host:puerto/nombre_db
     ```
   - Puedes guiarte con el archivo `.env.example` si existe.

4. **Configura la base de datos:**
   - Modifica la variable `DATABASE_URL` en tu `.env` con los datos de tu base de datos MySQL.
   - Ejecuta las migraciones de Prisma:
     ```bash
     npx prisma migrate dev --name init
     ```
   - (Opcional) Abre Prisma Studio para ver los datos:
     ```bash
     npx prisma studio
     ```

5. **Ejecuta el proyecto en modo desarrollo:**
   ```bash
   npm run dev
   ```
   El servidor se iniciará y estará listo para recibir peticiones.

## Comandos útiles
- `npm run dev`: Ejecuta el servidor en modo desarrollo con recarga automática.
- `npm run build`: Compila el proyecto a JavaScript.
- `npm start`: Ejecuta el servidor compilado.
- `npx prisma studio`: Abre una interfaz visual para la base de datos.
- `npx prisma generate`: Genera el cliente Prisma después de cambios en el esquema.
- `npx prisma migrate dev --name nombre_migracion`: Crea y aplica una nueva migración de base de datos. Reemplaza `nombre_migracion` con un nombre descriptivo para tu migración.
- `npx serverless offline start`: Ejecuta el servidor localmente simulando el entorno AWS Lambda.

## Notas
- Asegúrate de que tu variable `JWT_SECRET` sea segura y no la compartas públicamente.
- No subas tu archivo `.env` al repositorio.
- Si necesitas desplegar en AWS con Serverless Framework, asegúrate de tener configuradas tus credenciales de AWS correctamente.

---