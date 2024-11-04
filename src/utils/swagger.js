// swagger.js

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Joysticks API Documentation",
      version: "1.0.0",
      description: "API documentation for frontend and backend Joysticks",
    },
    servers: [
      {
        url: "http://92.255.77.185:8000/api",
      },
      {
        url: "https://e-education-backend-test.onrender.com/api",
      },
      {
        url: "https://e-education-backend.onrender.com/api",
      },
      {
        url: "http://localhost:8000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
