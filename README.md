# 📁 FileBox API | Luis Alvarez - Full Stack

Este proyecto es una API backend modular y segura para gestión de usuarios, autenticación y archivos en S3 (Localstack), desarrollada con Express, TypeScript y Firebase Admin. Incluye endpoints protegidos, validación robusta, documentación Swagger, manejo de variables de entorno y buenas prácticas de arquitectura. El objetivo es demostrar habilidades en diseño de APIs, seguridad, integración con servicios externos y mantenibilidad profesional.

📦 Estructura del repo

## 📦 Estructura del repo

```
Luis_Alvarez_FullStack_API/
├─ src/
│   ├─ config/
│   ├─ middlewares/
│   ├─ modules/
│   ├─ routes/
│   │   ├─ auth/
│   │   ├─ files/
│   │   └─ users/
│   ├─ services/
│   ├─ types/
│   ├─ utils/
│   └─ index.ts
├─ .env
├─ package.json
├─ README.md
└─ tsconfig.json
```

## 🧪 Descripción funcional

La API permite:

- Registro, login y logout de usuarios con JWT y refresh tokens.
- Gestión CRUD de usuarios autenticados.
- Subida, descarga, renombrado y obtención de enlaces públicos de archivos en S3 (Localstack).
- Envío de correos de verificación y restablecimiento de contraseña usando plantillas HTML.
- Documentación interactiva de la API con Swagger en /api-docs.

---

## 🚀 Cómo iniciar el proyecto

### 1. Clonar el repositorio

```bash
git clone
cd Luis_Alvarez_FullStack_API
```

### 2. Requisitos previos

- Tener Docker Desktop instalado y corriendo.
- Tener AWS CLI instalado y configurado con las credenciales dummy (test/test).

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno y credenciales de Firebase

Crea el archivo `.env` y completa los valores necesarios para Firebase, JWT, S3 y correo.

Además, debes agregar el archivo `serviceAccount.json` de tu proyecto de Firebase en la carpeta `src/` y en la ruta que definas en la variable `FIREBASE_SERVICE_ACCOUNT`.

Variables requeridas:

- PORT
- FIREBASE_SERVICE_ACCOUNT
- JWT_SECRET
- JWT_REFRESH_SECRET
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- S3_ENDPOINT
- BUCKET_NAME
- EMAIL_FROM

### 5. Iniciar Localstack (terminal 1):

```bash
docker run --rm -it -p 4566:4566 -e SERVICES=s3 localstack/localstack
```

### 6. Crea el bucket en Localstack (terminal 2):

```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://testing-bucket
```

El bucket de testing estará disponible en: `http://localhost:4566/testing-bucket`

### 7. Iniciar la API (terminal 3)

```bash
npm run dev
```

La API estará disponible en: `http://localhost:3000`

La documentación Swagger estará disponible en: `http://localhost:3000/api-docs`


## 📚 Consideraciones técnicas

- Arquitectura modular y escalable con TypeScript.
- Validación de datos y manejo de errores centralizado.
- Seguridad con JWT, refresh tokens y middlewares personalizados.
- Integración con S3 (Localstack) para gestión de archivos.
- Documentación Swagger disponible en /api-docs.
- Uso de variables de entorno para toda la configuración sensible.
- Código y commits siguiendo buenas prácticas y convenciones.

## 🧠 Autor

**Luis Fernando Alvarez Leccia - Full Stack Web Developer**