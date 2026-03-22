const pool = require('../db/connection_db');

class MetodosPagoModel {
  static _validarDatos(metodo) {
    const errors = [];
    const camposObligatorios = ['nombre'];
    for (const campo of camposObligatorios) {
      if (metodo[campo] === undefined || metodo[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof (metodo.nombre) !== "string" || metodo.nombre == "") {
      errors.push("El nombre del método debe ser una cadena de texto");
    }

    return errors;
  }
  static mostrar_metodos_pago() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `metodos_pago`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_metodos_pago_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `metodos_pago` WHERE id_metodo = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay métodos de pago registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_metodo(metodo) {
    return new Promise((resolve, reject) => {
      const error = MetodosPagoModel._validarDatos(metodo);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `metodos_pago` SET ?', metodo)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_metodo(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = MetodosPagoModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `metodos_pago` SET ? WHERE `id_metodo`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay métodos de pago registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_metodo(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `metodos_pago` WHERE `id_metodo` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay métodos de pago registrados con ese ID", result: rows })
        })
        .catch((err) => {
          // El código 1451 corresponde a restricción de llave foránea
          if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
            return reject({ code: 500, message: "No se puede eliminar el método de pago porque tiene ventas asignadas", result: [err] })
          }
          reject({ code: 500, message: err.message, result: [err] })
        });
    });
  }
}

module.exports = MetodosPagoModel;