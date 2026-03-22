const pool = require('../db/connection_db');

class PeliculasModel {
  static _validarDatos(peli) {
    const errors = [];
    const camposObligatorios = ['titulo', 'anio', 'duracion', 'id_clasificacion'];
    for (const campo of camposObligatorios) {
      if (peli[campo] === undefined || peli[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof (peli.titulo) !== "string" || peli.titulo == "") {
      errors.push("El título debe ser una cadena de texto");
    }

    if (isNaN(peli.anio) || peli.anio <= 0 || isNaN(peli.duracion) || peli.duracion <= 0 || isNaN(peli.id_clasificacion) || peli.id_clasificacion <= 0) {
      errors.push("El año, la duración, y el id de la clasificación deben ser números válidos");
    }

    return errors;
  }
  static _agruparPeliculas(list) {
    const peliculasAgrupadas = {};

    list.forEach(element => {
      const { id_pelicula, titulo, anio, duracion, id_clasificacion, clasificacion, nombre_categoria, id_categoria } = element;

      // Iniciar un nuevo objeto para cada película
      if (!peliculasAgrupadas[id_pelicula]) {
        peliculasAgrupadas[id_pelicula] = {
          id_pelicula,
          titulo,
          anio,
          duracion,
          id_clasificacion,
          clasificacion,
          categorias: []
        };
      }

      // Agregar la categoría actual al array de esa película
      peliculasAgrupadas[id_pelicula].categorias.push({
        id_categoria: id_categoria,
        nombre_categoria: nombre_categoria
      });
    });

    return Object.values(peliculasAgrupadas);
  }
  static _categoriasEntradaList(categorias_list) {
    if (typeof(categorias_list) === "string") { //En caso de que llegue una categoría por el checkbox
      categorias_list = [categorias_list];
    } else if (!categorias_list) {
      categorias_list = []; // En caso de que no se marque ninguna
    }
    return categorias_list;
  }
  static mostrar_peliculas() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT peliculas.id_pelicula, peliculas.titulo, peliculas.anio, peliculas.duracion, clasificacion_peliculas.id_clasificacion, clasificacion_peliculas.nombre AS clasificacion, categorias.id_categoria, categorias.nombre AS nombre_categoria FROM `peliculas` LEFT JOIN `clasificacion_peliculas` ON peliculas.id_clasificacion = clasificacion_peliculas.id_clasificacion LEFT JOIN `peliculas_categorias` ON peliculas.id_pelicula = peliculas_categorias.id_pelicula LEFT JOIN `categorias` ON categorias.id_categoria = peliculas_categorias.id_categoria ORDER BY peliculas.id_pelicula;')
        .then(([rows]) => {
          const resultadoFinal = PeliculasModel._agruparPeliculas(rows);
          resolve({ code: 200, message: "consulta completada con éxito", result: resultadoFinal })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_peliculas_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT peliculas.id_pelicula, peliculas.titulo, peliculas.anio, peliculas.duracion, clasificacion_peliculas.id_clasificacion, clasificacion_peliculas.nombre AS clasificacion, categorias.id_categoria, categorias.nombre AS nombre_categoria FROM `peliculas` LEFT JOIN `clasificacion_peliculas` ON peliculas.id_clasificacion = clasificacion_peliculas.id_clasificacion LEFT JOIN `peliculas_categorias` ON peliculas.id_pelicula = peliculas_categorias.id_pelicula LEFT JOIN `categorias` ON categorias.id_categoria = peliculas_categorias.id_categoria WHERE peliculas.id_pelicula = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            const resultadoFinal = PeliculasModel._agruparPeliculas(rows);
            resolve({ code: 200, message: "consulta completada con éxito", result: resultadoFinal })
          }
          resolve({ code: 404, message: "no hay películas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_pelicula(peli, categorias) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        // Obtener la conexión de la base de datos para manejar la transacción
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Validar datos 
        const errores = PeliculasModel._validarDatos(peli);
        if (errores.length > 0) {
          throw { code: 400, message: "Datos de película inválidos", result: errores };
        }

        categorias = PeliculasModel._categoriasEntradaList(categorias);

        // Insertar la película
        const [peliResult] = await connection.query('INSERT INTO `peliculas` SET ?', peli);
        const nuevaPeliId = peliResult.insertId;

        // Insertar categorías (si existen)
        if (categorias && categorias.length > 0) {
          const valoresCategorias = categorias.map(id_cat => [nuevaPeliId, id_cat]);
          await connection.query(
            'INSERT INTO `peliculas_categorias` (id_pelicula, id_categoria) VALUES ?',
            [valoresCategorias]
          );
        }

        // Confirmar cambios
        await connection.commit();

        resolve({
          code: 201,
          message: "Película y categorías registradas con éxito",
          result: { id_pelicula: nuevaPeliId }
        });

      } catch (err) {
        // Si algo falla, deshacemos todo lo anterior
        if (connection) await connection.rollback();

        reject({
          code: err.code || 500,
          message: err.message || "Error al registrar la película",
          result: err.result || [err]
        });
      } finally {
        // Liberar la conexión de vuelta al pool
        if (connection) connection.release();
      }
    });
  }
  static editar_pelicula(id, actualizar, categorias) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // validar datos
        const errores = PeliculasModel._validarDatos(actualizar);
        if (errores.length > 0) {
          throw { code: 400, message: "Datos inválidos", result: errores };
        }

        categorias = PeliculasModel._categoriasEntradaList(categorias);

        // Actualizar la tabla de peliculas
        const [updateResult] = await connection.query(
          'UPDATE peliculas SET ? WHERE id_pelicula = ?',
          [actualizar, id]
        );

        // Si no se afectó ninguna fila, el ID no existe
        if (updateResult.affectedRows === 0) {
          throw { code: 404, message: "No se encontró ninguna película con ese ID", result: [] };
        }

        // Quitar las categorías viejas
        await connection.query('DELETE FROM peliculas_categorias WHERE id_pelicula = ?', [id]);

        // Insertar las nuevas categorías (si existen)
        if (categorias && categorias.length > 0) {
          const categorias_insert = categorias.map(id_cat => [id, id_cat]);
          await connection.query(
            'INSERT INTO peliculas_categorias (id_pelicula, id_categoria) VALUES ?',
            [categorias_insert]
          );
        }

        await connection.commit(); // Confirmar cambios

        resolve({
          code: 200,
          message: "Película y categorías actualizadas con éxito",
          result: updateResult
        });

      } catch (err) {
        if (connection) await connection.rollback(); // Revertir si algo falla
        reject({
          code: err.code || 500,
          message: err.message || "Error al editar la película",
          result: err.result || [err]
        });
      } finally {
        if (connection) connection.release();
      }
    });
  }
  static eliminar_pelicula(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `peliculas` WHERE `id_pelicula` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay películas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
}

module.exports = PeliculasModel;