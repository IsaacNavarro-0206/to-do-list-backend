# To-Do List Backend

API backend para una aplicación de lista de tareas (To-Do List) usando Node.js, TypeScript, Prisma y JWT.

## Requisitos

- Node.js >= 18 (se recomienda la última versión LTS)
- npm >= 9 (generalmente se instala con Node.js)
- Serverless Framework instalado globalmente: `npm install -g serverless` (si vas a desplegar o usar `serverless offline`)
- Base de datos MySQL (puedes usar un servicio local o en la nube, por ejemplo, Docker, XAMPP, AWS RDS, etc.)

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

4. **Configura la base de datos:**

   - Modifica la variable `DATABASE_URL` en tu `.env` con los datos de tu base de datos MySQL.
   - Ejecuta los comandos de Prisma en el siguiente orden:

     ```bash
     # 1. Generar el cliente Prisma (necesario después de cualquier cambio en el schema)
     npx prisma generate

     # 2. Crear y aplicar migraciones
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

6. **Ejecuta el proyecto con Serverless Offline:**
   ```bash
   npx serverless offline start
   ```
   El servidor se ejecutará localmente simulando el entorno AWS Lambda.

## Comandos útiles

- `npm run dev`: Ejecuta el servidor en modo desarrollo con recarga automática.
- `npm run build`: Compila el proyecto a JavaScript.
- `npm start`: Ejecuta el servidor compilado.
- `npx prisma studio`: Abre una interfaz visual para la base de datos.
- `npx prisma generate`: Genera el cliente Prisma después de cambios en el esquema.
- `npx prisma migrate dev --name nombre_migracion`: Crea y aplica una nueva migración de base de datos. Reemplaza `nombre_migracion` con un nombre descriptivo para tu migración.
- `npx serverless offline start`: Ejecuta el servidor localmente simulando el entorno AWS Lambda.

## Estructura de la API

### Autenticación

- `POST /auth/register`: Registro de usuarios
- `POST /auth/login`: Inicio de sesión

### Listas

- `GET /lists`: Obtener todas las listas del usuario
- `POST /lists`: Crear una nueva lista
- `PATCH /lists/{listId}`: Actualizar una lista
- `DELETE /lists/{listId}`: Eliminar una lista

### Tareas

- `GET /lists/{listId}/tasks`: Obtener tareas de una lista
- `POST /lists/{listId}/tasks`: Crear una nueva tarea
- `PATCH /tasks/{taskId}`: Actualizar una tarea
- `DELETE /tasks/{taskId}`: Eliminar una tarea

## Notas

- Asegúrate de que tu variable `JWT_SECRET` sea segura y no la compartas públicamente.
- No subas tu archivo `.env` al repositorio.
- Si necesitas desplegar en AWS con Serverless Framework, asegúrate de tener configuradas tus credenciales de AWS correctamente.

---
