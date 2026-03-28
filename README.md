# Backend-E-actividad-3.1

## Sistema de Gestión de Cine

Proyecto web (Express + EJS) para gestionar un cine con las entidades: Películas, Funciones, Salas, Ventas, Productos y Entradas.

### Resumen de las características principales

- Ingresar datos a todas las entidades definidas.
- Mostrar elementos de una determinada entidad por su id.
- Mostrar los últimos 5 elementos de algún grupo de una entidad según un criterio de ordenamiento específico. (Las últimas 5 funciones más recientes)
- Mostrar los elementos de una entidad en un rango de fecha. (Mostrar ventas en un rango específico)
- Eliminar elementos de todas las entidades definidas. 
- Eliminar la relación entre elementos de dos o más entidades. 
- Modificar datos de todas las entidades definidas.
- Vistas EJS para administración y para usuarios finales.

### Estructura importante del proyecto

- `app.js` — punto de entrada (monta rutas y middlewares).
- `routes/` — rutas para `entradas`, `funciones`, `peliculas`, `productos`, `salas`, `ventas`, `ventas de productos` etc.
- `controllers/` — lógica de negocio para cada entidad.
- `models/` — manejo de promesas para consultas con la base de datos.
- `views/` — plantillas EJS (vistas del sistema).
- `db/` — archivo de conexión con la base de datos (Adicionalmente se encuentra adjunto el archivo para recrear la base de datos).
- `auth/` — funciones para verificar roles de usuarios.

### Requisitos

- Node.js (>= 16 recomendado) y `npm`.
- Xampp Control Panel (Para manejar la base de datos mysql) o algún gestor de bases de datos sql.
- Archivo .sql para recrear la base de datos del proyecto.
- Archivo .env con las variables de entorno para la base de datos. En caso de que quiera recrearlo escriba lo siguiente en su archivo .env: 

```

DB_HOST = localhost
DB_USER = root
DB_PASSWORD = 
DB_DATABASE = cine
JWT_SECRET=secretJWT_token

```

### Instalación y puesta en marcha (Windows / PowerShell)

1. Crear la base de datos con el nombre "cine":

- Si utiliza una herramienta grafica como la que le ofrece Xampp con phpMyAdmin puede importar directamente el archivo sql adjunto en el proyecto.
- En caso de que use algún otro gestor de bases de datos sql puede reconstruir la base de datos utilizando los comandos del archivo sql para recrearla.

2. Poner en marcha la base de datos

- Si utiliza Xampp ponga en marcha el gestor phpMyAdmin al presionar start para "Apache" y "MySQL".
- En caso de utilizar otro servicio levante la base de datos creada por medio de comandos.

3. Ajuste sus variables de entorno en el archivo .env para asegurar la conexión con la base de datos.

- DB_HOST = [Indique el host]
- DB_USER = [Indique el usuario que usa su base de datos]
- DB_PASSWORD = [Indique la contraseña en caso de que su base de datos la tenga]
- DB_DATABASE = [Indique el nombre de su base de datos]
- JWT_SECRET = [Frase semilla para la firma y validación de los JSON Web Tokens (ej. secretJWT_token)]

4. Clonar el repositorio y entrar en el directorio:

```powershell
git clone <repo-url>
cd 'Backend-E-actividad-3.1'
```

5. Instalar dependencias:

```powershell
npm install
```

6. Iniciar la aplicación (modo desarrollo con `nodemon`):

```powershell
npm run dev
```

7. Simular alguna de las posibles peticiones del frontend utilizando Thunder Client. Y sus roles de usuario para ejecutarlas

- `/asientos` 
  - `/mostrar` — (GET) Mostrar todos los asientos. (admin)
  - `/buscar/:id` — (GET) Mostrar asientos por su ID. (admin)
  - `/ingresar` — (POST) Ingresar asientos. (admin)
  - `/editar/:id` — (PUT) Editar asientos. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar asientos por su ID. (admin)

- `/categorias` 
  - `/mostrar` — (GET) Mostrar todas las categorías. (admin)
  - `/buscar/:id` — (GET) Mostrar categorías por su ID. (admin)
  - `/ingresar` — (POST) Ingresar categorías. (admin)
  - `/editar/:id` — (PUT) Editar categorías. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar categorías por su ID. (admin)

- `/clasificaciones` 
  - `/mostrar` — (GET) Mostrar todas las clasificaciones. (admin)
  - `/buscar/:id` — (GET) Mostrar clasificaciones por su ID. (admin)
  - `/ingresar` — (POST) Ingresar clasificaciones. (admin)
  - `/editar/:id` — (PUT) Editar clasificaciones. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar clasificaciones por su ID. (admin)

- `/metodos` 
  - `/mostrar` — (GET) Mostrar todos los métodos. (admin)
  - `/buscar/:id` — (GET) Mostrar métodos por su ID. (admin)
  - `/ingresar` — (POST) Ingresar métodos. (admin)
  - `/editar/:id` — (PUT) Editar métodos. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar métodos por su ID. (admin)

- `/peliculas` 
  - `/mostrar` — (GET) Mostrar todas las películas. (Sin rol)
  - `/buscar/:id` — (GET) Mostrar películas por su ID. (Sin rol)
  - `/ingresar` — (POST) Ingresar películas. (admin)
  - `/editar/:id` — (PUT) Editar películas. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar películas por su ID. (admin)

- `/funciones` 
  - `/mostrar` — (GET) Mostrar todas las funciones. (Sin rol)
  - `/buscar/:id` — (GET) Mostrar funciones por su ID. (Sin rol)
  - `/funciones_recientes` — (GET) Mostrar las últimas 5 funciones recientes. (Sin rol)
  - `/ingresar` — (POST) Ingresar funciones. (admin)
  - `/editar/:id` — (PUT) Editar funciones. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar funciones por su ID. (admin)

- `/salas` 
  - `/mostrar` — (GET) Mostrar todas las salas. (Sin rol)
  - `/buscar/:id` — (GET) Mostrar salas por su ID. (Sin rol)
  - `/ingresar` — (POST) Ingresar salas. (admin)
  - `/editar/:id` — (PUT) Editar salas. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar salas por su ID. (admin)

- `/ventas` 
  - `/mostrar` — (GET) Mostrar todas las ventas. (admin)
  - `/buscar/:id` — (GET) Mostrar ventas por su ID. (admin)
  - `/rango` — (GET) Mostrar ventas en un rango de fecha. (admin)
  - `/ingresar` — (POST) Ingresar ventas. (admin)
  - `/editar/:id` — (PUT) Editar ventas. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar ventas por su ID. (admin)

- `/productos` 
  - `/mostrar` — (GET) Mostrar todos los productos. (admin)
  - `/en_stock` — (GET) Mostrar los productos en stock. (Sin rol)
  - `/buscar/:id` — (GET) Mostrar productos por su ID. (Sin rol)
  - `/ingresar` — (POST) Ingresar productos. (admin)
  - `/editar/:id` — (PUT) Editar productos. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar productos por su ID. (admin)

- `/ventas_productos` 
  - `/mostrar` — (GET) Mostrar todas las ventas de productos. (admin)
  - `/buscar/:id` — (GET) Mostrar ventas de productos por su ID. (Sin rol)
  - `/tus_compras` — (GET) Mostrar las ventas de productos por un usuario. (user)
  - `/ingresar` — (POST) Ingresar ventas de productos. (user)
  - `/editar/:id` — (PUT) Editar ventas de productos. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar ventas de productos por su ID. (admin)

- `/entradas` 
  - `/mostrar` — (GET) Mostrar todas las entradas. (Sin rol)
  - `/no_vendidas` — (GET) Mostrar todas las entradas sin vender. (Sin rol)
  - `/vendidas` — (GET) Mostrar todas las entradas vendidas. (Sin rol)
  - `/buscar/:id` — (GET) Mostrar entradas por su ID. (Sin rol)
  - `/tus_compras` — (GET) Mostrar las entradas compradas por un usuario. (user)
  - `/ingresar` — (POST) Ingresar entradas. (admin)
  - `/vender` — (PUT) Vender entradas. (user)
  - `/editar/:id` — (PUT) Editar entradas. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar entradas por su ID. (admin)

- `/usuarios` 
  - `/mostrar` — (GET) Mostrar todos los usuarios. (admin)
  - `/buscar/:id` — (GET) Mostrar usuarios por su ID. (Sin rol)
  - `/ingresar` — (POST) Ingresar usuarios. (Sin rol)
  - `/ingresar_admin` — (POST) Ingresar admins. (admin)
  - `/login` — (POST) Login. (Sin rol)
  - `/editar/:id` — (PUT) Editar usuarios. (admin)
  - `/eliminar/:id` — (DELETE) Eliminar usuarios por su ID. (admin)

8. Acceder en el navegador a `http://localhost:3000/` para interactuar con la interfaz EJS.

### Credenciales de los Usuarios de Prueba Registrados

- Administrador:

  ```
    {
      "email": "admin@gmail.com",
      "password": "admin"
    }
  ```

- Usuario normal:

  ```
    {
      "email": "user@gmail.com",
      "password": "user"
    }
  ```

### Entradas JSON (Ejemplos)

Para probar las consultas de ingresar y editar de cada entidad:

- Asientos
  - Ingresar/editar:

  ```
    {
      "nombre": "A113"
    }
  ```

- Categorías
  - Ingresar/editar:

  ```
    {
      "nombre": "Terror"
    }
  ```

- Clasificaciones
  - Ingresar/editar:

  ```
    {
      "nombre": "C"
    }
  ```

- Métodos de Pago
  - Ingresar/editar:

  ```
    {
      "nombre": "Tarjeta BOD"
    }
  ```

- Películas
  - Ingresar/editar:

  ```
    {
      "titulo": "Star Wars: Episodio IV",
      "anio": 1977,
      "duracion": 125,
      "id_clasificacion": 1,
      "categorias": [1,2]
    }
  ```

- Funciones
  - Ingresar/editar:

  ```
    {
      "id_pelicula": 4,
      "id_sala": 3,
      "fecha_hora": "2026-02-14 18:00:00"
    }
  ```

- Salas
  - Ingresar/editar:

  ```
    {
      "nombre": "Sala Platino",
      "capacidad": 200
    }
  ```

- Ventas
  - Ingresar:

  ```
    {
      "id_metodo": 2,
      "total": 12.50
    }
  ```

  - Editar:

  ```
    {
      "id_metodo": 3,
      "fecha": "2025-01-01 18:00:00",
      "total": 50.2
    }
  ```

- Productos
  - Ingresar/editar:

  ```
    {
      "nombre": "chicle",
      "cantidad": 150,
      "precio_unitario": 2.50
    }
  ```

- Ventas de Productos
  - Ingresar:

  ```
    {
      "id_metodo": 2,
      "productos": [
        {
          "id_producto": 1,
          "cantidad": 1,
          "subtotal": 10
        },
        {
          "id_producto": 2,
          "cantidad": 3,
          "subtotal": 6
        }
      ]
    }
  ```

  - Editar:

  ```
    {
      "id_producto": 1,
      "cantidad": 3,
      "subtotal": 30
    }
  ```

- Entradas
  - Ingresar:

  ```
    {
      "entradas": [
        {
          "id_funcion": 4,
          "id_asiento": 1,
          "precio": 5
        },
        {
          "id_funcion": 4,
          "id_asiento": 2,
          "precio": 5
        }
      ]
    }
  ```

- Vender:

  ```
    {
      "id_metodo": 2,
      "entradas": [
        {
          "id_entrada": 45,
          "precio": 15
        },
        {
          "id_entrada": 46,
          "precio": 15
        }
      ]
    }
  ```

  - Editar:

  ```
    {
      "id_funcion": 4,
      "id_asiento": 2,
      "precio": 15  
    }
  ```

- Usuarios
  - Ingresar/editar:

  ```
    {
      "email": "test@gmail.com",
      "password": "test"
    }
  ```

### Enlace del video en YouTube

[Video de Youtube](https://youtu.be/qn6Q0YKvplI?si=VLjYd-Pdj0VdqFX_)

---

#### Licencia
- Este proyecto es un ejercicio/plantilla.