import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestión de Archivos",
      version: "1.0.0",
      description:
        "Documentación de la API para gestión de archivos con S3 y Localstack",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "./src/routes/files/*.ts",
    "./src/routes/users/*.ts",
    "./src/routes/auth/*.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
