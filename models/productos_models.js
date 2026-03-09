const pool = require('../db/connection_db');

class ProductosModel {
  static _validarDatos(producto) {
    const errors = [];
    const camposObligatorios = ['nombre', 'cantidad', 'precio_unitario'];
    for (const campo of camposObligatorios) {
      if (producto[campo] === undefined || producto[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof (producto.nombre) !== "string") {
      errors.push("El nombre del producto debe ser una cadena de texto");
    }

    if (isNaN(producto.precio_unitario) || producto.precio_unitario < 0 || isNaN(producto.cantidad) || producto.cantidad < 0) {
      errors.push("El precio y la cantidad deben ser números válidos");
    }

    return errors;
  }
  static mostrar_productos() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `productos`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_productos_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `productos` WHERE id_producto = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay productos registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_producto(producto) {
    return new Promise((resolve, reject) => {
      const error = ProductosModel._validarDatos(producto);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `productos` SET ?', producto)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_producto(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = ProductosModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `productos` SET ? WHERE `id_producto`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay productos registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_producto(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `productos` WHERE `id_producto` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay productos registrados con ese ID", result: rows })
        })
        .catch((err) => {
          // El código 1451 corresponde a restricción de llave foránea
          if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
            return reject({ code: 500, message: "No se puede eliminar el producto porque tiene ventas asignadas", result: [err] })
          }
          reject({ code: 500, message: err.message, result: [err] })
        });
    });
  }
}

module.exports = ProductosModel;