const pool = require('../db/connection_db');

class VentasModel {
  static _validarDatos(venta) {
    const errors = [];
    const camposObligatorios = ['id_metodo', 'total', 'fecha'];
    for (const campo of camposObligatorios) {
      if (venta[campo] === undefined || venta[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (isNaN(venta.id_metodo) || venta.id_metodo <= 0 || isNaN(venta.total) || venta.total <= 0) {
      errors.push("El total de la venta y el id del método de pago deben ser números válidos");
    }

    const fecha = new Date(venta.fecha);

    if (isNaN(fecha.getTime())) {
      errors.push("Verifique el formato de la fecha");
    }

    return errors;
  }
  static _validarRangoDeFecha(rango) {
    const errors = [];
    const { inicio, fin } = rango;

    //Verificar que hay fecha de inicio y fin
    if (!inicio || !fin) {
      errors.push("Falta el rango de fechas");
      return errors;
    }

    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    // Validar el formato de la fecha 
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      errors.push("El formato de la fecha es inválido");
      return errors;
    }

    // Validar que la Fecha de Inicio sea mayor
    if (fechaInicio > fechaFin) {
      errors.push("La fecha de inicio no puede ser mayor a la fecha de fin");
      return errors;
    }

    return errors;
  }
  static mostrar_ventas() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT ventas.id_venta, ventas.id_metodo, metodos_pago.nombre AS "metodo_de_pago" , ventas.fecha, ventas.total FROM `ventas` JOIN `metodos_pago` ON metodos_pago.id_metodo = ventas.id_metodo ORDER BY ventas.id_venta;')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_ventas_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT ventas.id_venta, ventas.id_metodo, metodos_pago.nombre AS "metodo_de_pago" , ventas.fecha, ventas.total FROM `ventas` JOIN `metodos_pago` ON metodos_pago.id_metodo = ventas.id_metodo WHERE id_venta = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay ventas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_ventas_por_rango(rango) {
    return new Promise((resolve, reject) => {

      const error = VentasModel._validarRangoDeFecha(rango);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar el rango de fecha", result: error })
        return;
      }

      const { inicio, fin } = rango;

      pool.query('SELECT ventas.id_venta, ventas.id_metodo, metodos_pago.nombre AS "metodo_de_pago" , ventas.fecha, ventas.total FROM `ventas` JOIN `metodos_pago` ON metodos_pago.id_metodo = ventas.id_metodo  WHERE `fecha` BETWEEN ? AND ? ORDER BY `ventas`.`fecha` ASC', [inicio, fin])
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay ventas registradas con ese rango", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_venta(venta) {
    return new Promise((resolve, reject) => {

      // Obtener la fecha actual
      venta.fecha = new Date();
      
      const error = VentasModel._validarDatos(venta);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('INSERT INTO `ventas` SET ?', venta)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_venta(id, actualizar) {
    return new Promise((resolve, reject) => {
       const error = VentasModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `ventas` SET ? WHERE `id_venta`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay ventas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_venta(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `ventas` WHERE `id_venta` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay ventas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
}

module.exports = VentasModel;