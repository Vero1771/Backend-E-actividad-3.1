const pool = require('../db/connection_db');

class FuncionesModel {
  static _validarDatos(funcion) {
    const errors = [];
    const camposObligatorios = ['id_pelicula', 'id_sala', 'fecha_hora'];
    for (const campo of camposObligatorios) {
      if (funcion[campo] === undefined || funcion[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (isNaN(funcion.id_pelicula) || funcion.id_pelicula <= 0 || isNaN(funcion.id_sala) || funcion.id_sala <= 0) {
      errors.push("El id de la película, y el id de la sala deben ser números válidos");
    }

    const fecha = new Date(funcion.fecha_hora);

    if (isNaN(fecha.getTime())) {
      errors.push("Verifique el formato de la fecha");
    }

    return errors;
  }
  static mostrar_funciones() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT funciones.id_funcion, peliculas.id_pelicula, peliculas.titulo, salas.id_sala, salas.nombre, funciones.fecha_hora FROM `funciones` JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala ORDER BY funciones.id_funcion;')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_funciones_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT funciones.id_funcion, peliculas.id_pelicula, peliculas.titulo, salas.id_sala, salas.nombre, funciones.fecha_hora FROM `funciones` JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala WHERE id_funcion = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay funciones registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_funciones_recientes() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT funciones.id_funcion, peliculas.id_pelicula, peliculas.titulo, salas.id_sala, salas.nombre, funciones.fecha_hora FROM `funciones` JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala ORDER BY fecha_hora DESC LIMIT 5;')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_funcion(funcion) {
    return new Promise((resolve, reject) => {
      const error = FuncionesModel._validarDatos(funcion);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `funciones` SET ?', funcion)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_funcion(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = FuncionesModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `funciones` SET ? WHERE `id_funcion`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay funciones registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_funcion(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `funciones` WHERE `id_funcion` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay funciones registradas con ese ID", result: rows })
        })
        .catch((err) => {
          // El código 1451 corresponde a restricción de llave foránea
          if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
            return reject({ code: 500, message: "No se puede eliminar la función porque tiene entradas asignadas", result: [err] })
          }
          reject({ code: 500, message: err.message, result: [err] })
        });
    });
  }
}

module.exports = FuncionesModel;