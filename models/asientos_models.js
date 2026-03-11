const pool = require('../db/connection_db');

class AsientosModel {
  static _validarDatos(asiento) {
    const errors = [];
    const camposObligatorios = ['nombre'];
    for (const campo of camposObligatorios) {
      if (asiento[campo] === undefined || asiento[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof(asiento.nombre) !== "string") {
      errors.push("El nombre del asiento debe ser una cadena de texto");
    }

    return errors;
  }
  static mostrar_asientos() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `asientos`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_asientos_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `asientos` WHERE id_asiento = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay asientos registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_asiento(asiento) {
    return new Promise((resolve, reject) => {
      const error = AsientosModel._validarDatos(asiento);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `asientos` SET ?', asiento)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_asiento(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = AsientosModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `asientos` SET ? WHERE `id_asiento`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay asientos registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_asiento(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `asientos` WHERE `id_asiento` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay asientos registrados con ese ID", result: rows })
        })
        .catch((err) => {
          // El código 1451 corresponde a restricción de llave foránea
          if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
            return reject({ code: 500, message: "No se puede eliminar el asiento porque tiene entradas asignadas", result: [err] })
          }
          reject({ code: 500, message: err.message, result: [err] })
        });
    });
  }
}

module.exports = AsientosModel;