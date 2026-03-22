const pool = require('../db/connection_db');

class SalasModel {
  static _validarDatos(sala) {
    const errors = [];
    const camposObligatorios = ['nombre', 'capacidad'];
    for (const campo of camposObligatorios) {
      if (sala[campo] === undefined || sala[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof (sala.nombre) !== "string" || sala.nombre == "") {
      errors.push("El nombre de la sala debe ser una cadena de texto");
    }

    if (isNaN(sala.capacidad) || sala.capacidad <= 0) {
      errors.push("La capacidad de la sala debe ser un número válido");
    }

    return errors;
  }
  static mostrar_salas() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `salas`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_salas_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `salas` WHERE id_sala = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay salas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_sala(sala) {
    return new Promise((resolve, reject) => {
      const error = SalasModel._validarDatos(sala);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `salas` SET ?', sala)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_sala(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = SalasModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `salas` SET ? WHERE `id_sala`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay salas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_sala(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `salas` WHERE `id_sala` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay salas registradas con ese ID", result: rows })
        })
        .catch((err) => {
          // El código 1451 corresponde a restricción de llave foránea
          if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
            return reject({ code: 500, message: "No se puede eliminar la sala porque tiene funciones asignadas", result: [err] })
          }
          reject({ code: 500, message: err.message, result: [err] })
        });
    });
  }
}

module.exports = SalasModel;