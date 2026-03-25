# Portafolio Ele Backend

Este repositorio contiene la API (Backend) para el Portafolio Personal de Eleazar, construida utilizando el framework progresivo de Node.js, [NestJS](https://nestjs.com/).

## 🚀 Características Principales

- **Gestión de Proyectos:** Endpoints para crear, leer, actualizar y eliminar (CRUD) información sobre proyectos del portafolio.
- **Gestión de Tecnologías:** Administración de tecnologías individuales y sus categorías asociadas (ej. Frontend, Backend, Tools).
- **Autenticación Segura (JWT):** Sistema de autenticación de usuarios basado en JSON Web Tokens (JWT) con enrutamiento protegido mediante Bearer Auth.
- **Documentación de la API (Swagger):** Documentación interactiva de todos los endpoints, integrada y accesible con Swagger UI.
- **Base de Datos Relacional:** Configurado con **PostgreSQL** y **TypeORM** para el manejo e integridad de los datos.
- **Docker Ready:** Incluye soporte para su ejecución en contenedores con `Dockerfile` y `docker-compose.yml`.

## 🛠️ Tecnologías Utilizadas

- **Framework:** [NestJS](https://nestjs.com/) v11
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** JWT, bcryptjs
- **Documentación:** Swagger (OpenAPI)
- **Utilerías:** Class-validator, Class-transformer para la validación de DTOs, Nodemailer / Resend para correos.

## ⚙️ Requisitos Previos

Asegúrate de tener instalados:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [Docker](https://www.docker.com/) y Docker Compose (Opcional, pero sugerido para levantar la infraestructura)
- [PostgreSQL](https://www.postgresql.org/) (Si decides no utilizar Docker)

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/Eleazarguitar18/Protafolio-Ele-Backend.git
cd Protafolio-Ele-Backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Variables de Entorno:
   Asegúrate de crear tu archivo `.env` en la raíz del proyecto para definir tu configuración de Base de Datos y tus variables o firmas secretas para JWT.

## ▶️ Ejecución

```bash
# Modo normal
$ npm run start

# Modo desarrollo (auto-recarga)
$ npm run start:dev

# Modo producción
$ npm run start:prod
```

## 📚 Documentación (Swagger)

Con la aplicación ejecutándose localmente, puedes acceder a la interfaz interactiva de la API abriendo tu navegador en:

```
http://localhost:3000/api
```

_(El puerto principal puede variar según tu configuración de entorno y de `main.ts`)._

Aquí encontrarás todos los modelos (DTOs) definidos y cada uno de los métodos disponibles para su consumo, y una sección de **Authorize** donde puedes proporcionar el token devuelto tras un Login / Registro.

## 🧑‍💻 Autor

- **Eleazar** - _Desarrollo inicial y mantenimiento_ - [@Eleazarguitar18](https://github.com/Eleazarguitar18)
