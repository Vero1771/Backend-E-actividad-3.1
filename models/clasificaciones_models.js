const pool = require('../db/connection_db');

class ClasificacionesModel {
  static _validarDatos(clasificacion) {
    const errors = [];
    const camposObligatorios = ['nombre'];
    for (const campo of camposObligatorios) {
      if (clasificacion[campo] === undefined || clasificacion[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof (clasificacion.nombre) !== "string") {
      errors.push("El nombre de la clasificación debe ser una cadena de texto");
    }

    return errors;
  }
  static mostrar_clasificaciones() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `clasificacion_peliculas`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_clasificaciones_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `clasificacion_peliculas` WHERE id_clasificacion = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay clasificaciones registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_clasificacion(clasificacion) {
    return new Promise((resolve, reject) => {
      const error = ClasificacionesModel._validarDatos(clasificacion);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `clasificacion_peliculas` SET ?', clasificacion)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_clasificacion(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = ClasificacionesModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `clasificacion_peliculas` SET ? WHERE `id_clasificacion`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay clasificaciones registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_clasificacion(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `clasificacion_peliculas` WHERE `id_clasificacion` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay clasificaciones registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
}

module.exports = ClasificacionesModel;