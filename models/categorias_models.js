const pool = require('../db/connection_db');

class CategoriasModel {
  static _validarDatos(categoria) {
    const errors = [];
    const camposObligatorios = ['nombre'];
    for (const campo of camposObligatorios) {
      if (categoria[campo] === undefined || categoria[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof(categoria.nombre) !== "string") {
      errors.push("El nombre de la categoría debe ser una cadena de texto");
    }

    return errors;
  }
  static mostrar_categorias() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `categorias`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_categorias_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `categorias` WHERE id_categoria = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay categorías registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_categoria(categoria) {
    return new Promise((resolve, reject) => {
      const error = CategoriasModel._validarDatos(categoria);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `categorias` SET ?', categoria)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_categoria(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = CategoriasModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `categorias` SET ? WHERE `id_categoria`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay categorías registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_categoria(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `categorias` WHERE `id_categoria` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay categorías registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
}

module.exports = CategoriasModel;