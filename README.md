# 🧪 OlaClick Backend Challenge - Node/NestJS Edition - Oliver Carranza

## 🚀 Instrucciones de entrega de proyecto con Docker

Ejecutar los siguientes comandos para levantar el proyecto con Docker: 

- Clonar el proyecto
```bash
git clone https://github.com/olivercd15/challenge-nodejs-2025.git
```

- Ir a carpeta backend
```bash
cd Backend
```

- Copiar archivo .env
```bash
cp .env.example .env
```

- Construir el proyecto backend
```bash
npm run build
```

- Construir los contenedores
```bash
npm run docker:build
```

- Correr el entorno de Docker
```bash
npm run docker:up
```

- Realizar las migraciones
```bash
docker-compose exec app npx sequelize-cli db:migrate --config /app/dist/common/config/database.config.js --migrations-path /app/dist/common/database/migrations
```  

- Realizar los seeders (opcional)
```bash
docker-compose exec app npx sequelize-cli db:migrate --config /app/dist/common/config/database.config.js --seeders-path /app/dist/common/database/seeders
```  

- Verificar el proyecto backend corriendo en NestJS
```bash
docker logs backend-app-1 --follow
```  

- El enlace para revisar el proyecto es y se debe trabajar con Postman para lo cual se ha compartido la coleccion.

http://localhost:3000

-Backend/postman/OlaClick Backend Nest.postman_collection.json


## 📌 Requerimientos Funcionales
Sobre los requierimientos funcionales, se desarrollaron todos los endpoints solicitados con sus respectivos criterios


### 1. Listar órdenes
- Endpoint: `GET /api/orders`
- Retorna todas las órdenes activas (`status != 'delivered'`).
- Debe usar Redis para cachear el resultado (TTL: 30s).

### 2. Crear una nueva orden
- Endpoint: `POST /api/orders`
- Crea una nueva orden con estado inicial `initiated`.
- Estructura esperada:
  ```json
  {
    "client_name": "Carlos Gómez",
    "items": [
      { "description": "Lomo saltado", "quantity": 1, "unit_price": 60 },
      { "description": "Inka Kola", "quantity": 2, "unit_price": 10 }
    ]
  }

### 3. Avanzar estado de una orden
Endpoint: `POST /api/orders/{id}/advance`

Transición:

initiated → sent → delivered

Si llega a delivered, la orden debe ser eliminada de la base de datos y del caché.

### 4. Ver detalle de una orden
Endpoint: `GET /api/orders/{id}`

Muestra datos completos incluyendo items, totales y estado actual.



## 🧱 Consideraciones Técnicas
Sobre las consideraciones tecnicas y el stack de desarrollo se tiene lo siguiente: 
- NestJS - Typescript - Node 20.13
- Base de datos: PostgreSQL
- Integracion con Redis en: 
  - Listar Ordenes
  - Obtener Orden
- Arquitectura:
  - Modular
  - API Rest
- Principios SOLID aplicados: 
  - Single Responsability 
  - Open/Closed Principle
- Modelado con Sequelize ORM
- DTOs y Pipes para validaciones
- Tests realizados con Jest y e2e:
  - Listar ordenes
  - Crear orden exitosa
  - Avanzar con la orden
  - Obtener detalles de la orden
- Contenerización con Docker + Docker Compose


## 📘 Extras valorados
- Se esta trabajando con Interceptors para manejar una estructura de seguimento de codigo de errores y respuestas para todos los endpoints
- Se han trabajado 2 jobs, uno que elimina ordenes que se han quedado 30 dias y otro que simplemente devuelve las ordenes que han quedado pendientes
- Logs de cambios de estado: Se agrego una tabla en la base de datos, llamada "OrderStatusLogs", esta tabla guarda el estado actual y el estado siguiente cuando se ejecuta el servicio de Advance Order, cuando se elimina, este dato persiste como un historial. 
- Se esta trabajando con ConfigModule para sincronizar Sequelize y las variables de entorno con Postgres


## ❓ Preguntas opcionales para explicar
- ¿Cómo desacoplarías la lógica de negocio del framework NestJS?
  - Lo trabajaria aplicando Clean Architecture con interfaces, ya que actualmente solo se tiene el repository, pero para desacoplar dependencias, mixearia un poco lo que es la estructura Modular solicitada para trabajar con una arquitectura Clean Architecture, DDD o Hexagonal con los ports y adapters 

- ¿Cómo escalarías esta API para soportar miles de órdenes concurrentes?
  - Aplicaria el patron de CQRS ideal para separar estructuras de lectura y escritura, inclusive estimaria el ORM de ser necesario solo para las consultas de lectura con TypeORM y tambien una arquitectura desacoplada permitiria el desarrollo y los cambios sin afectar otras logicas de negocio a la hora de hacer las optimizaciones.

- ¿Qué ventajas ofrece Redis en este caso y qué alternativas considerarías?
  - Redis nos permite guardar informacion y utilizarla instantaneamente, para lo cual se han aplicado Decoradores en los controller de lectura GET, pero tambien seria ideal manejar una estructura mas robusta con eliminaciones y asignaciones de tokens de Redis para poder hacerlo mas optimo a la hora de respuestas rapidas, aunque no es para todos los casos, solo para las operaciones mas rutinarias y que requieren bastante flujo.

**¡Saludos!** 💡
