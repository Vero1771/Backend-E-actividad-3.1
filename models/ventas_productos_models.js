const pool = require('../db/connection_db');

class VentasProductosModel {
  static _validarDatosVenta(venta) {
    const errors = [];
    const camposObligatorios = ['id_metodo', 'fecha'];
    for (const campo of camposObligatorios) {
      if (venta[campo] === undefined || venta[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (isNaN(venta.id_metodo) || venta.id_metodo < 0) {
      errors.push("El id del método de pago debe ser un número válido");
    }

    const fecha = new Date(venta.fecha);

    if (isNaN(fecha.getTime())) {
      errors.push("Verifique el formato de la fecha");
    }

    return errors;
  }
  static _validarDatosVentasProductos(productos) { //Validar varios productos
    const errors = [];
    let errors_details = [];
    const camposObligatorios = ['id_producto', 'cantidad', 'subtotal'];
    productos.forEach((p, i) => {
      for (const campo of camposObligatorios) {
        if (p[campo] === undefined || p[campo] === null) errors_details.push(`El campo ${campo} es obligatorio`);
      }

      if (isNaN(p.id_producto) || p.id_producto < 0) {
        errors_details.push("El id del producto deben ser un número válido");
      }

      if (isNaN(p.cantidad) || p.cantidad < 0 || isNaN(p.subtotal) || p.subtotal < 0) {
        errors.push("El subtotal y la cantidad deben ser un números válidos y no puede ser negativos");
      }

      if (errors_details.length > 0) {
        errors.push({
          id_list_producto: i,
          producto: p,
          errors_details: errors_details
        })
        errors_details = [];
      }
    })

    return errors;
  }
  static _validarDatosProducto(producto) { //Validar un solo producto
    const errors = [];
    const camposObligatorios = ['id_producto', 'cantidad', 'subtotal'];
    for (const campo of camposObligatorios) {
      if (producto[campo] === undefined || producto[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (isNaN(producto.id_producto) || producto.id_producto < 0) {
      errors.push("El id del producto debe ser un número válido");
    }

    if (isNaN(producto.cantidad) || producto.cantidad < 0 || isNaN(producto.subtotal) || producto.subtotal < 0) {
      errors.push("El subtotal y la cantidad deben ser un números válidos y no puede ser negativos");
    }

    return errors;
  }
  static _calcularTotalVenta(productos) {
    let total = 0;

    productos.forEach((producto) => {
      total += producto.subtotal;
    })

    return total;
  }
  static mostrar_productos_vendidos() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT ventas_productos.id_venta_producto, productos.id_producto, productos.nombre AS "producto", productos.precio_unitario, ventas_productos.cantidad, ventas.id_venta, metodos_pago.nombre AS "metodo_pago", ventas.fecha, ventas.total FROM `ventas_productos` JOIN `productos` ON productos.id_producto = ventas_productos.id_producto JOIN `ventas` ON ventas.id_venta = ventas_productos.id_venta JOIN `metodos_pago` ON metodos_pago.id_metodo = ventas.id_metodo ORDER BY ventas_productos.id_venta_producto;')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_productos_vendidos_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT ventas_productos.id_venta_producto, productos.id_producto, productos.nombre AS "producto", productos.precio_unitario, ventas_productos.cantidad, ventas.id_venta, metodos_pago.nombre AS "metodo_pago", ventas.fecha, ventas.total FROM `ventas_productos` JOIN `productos` ON productos.id_producto = ventas_productos.id_producto JOIN `ventas` ON ventas.id_venta = ventas_productos.id_venta JOIN `metodos_pago` ON metodos_pago.id_metodo = ventas.id_metodo WHERE id_venta_producto = ?', id)
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
  static ingresar_producto_vendido(venta, venta_producto) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        // Obtener la conexión de la base de datos para manejar la transacción
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Obtener la fecha actual
        venta.fecha = new Date();

        // Validar datos 
        const error1 = VentasProductosModel._validarDatosVenta(venta);
        const error2 = VentasProductosModel._validarDatosVentasProductos(venta_producto);
        const errores = [...error1, ...error2];
        if (errores.length > 0) {
          throw { code: 400, message: "Datos de venta inválidos", result: errores };
        }

        // Obtener la fecha actual
        venta.fecha = new Date();

        // Calcular el total
        venta.total = VentasProductosModel._calcularTotalVenta(venta_producto);

        // Insertar la venta principal
        const [ventaResult] = await connection.query('INSERT INTO `ventas` SET ?', venta);
        const nuevaVentaId = ventaResult.insertId;

        // Insertar referencia de la venta
        if (venta_producto && venta_producto.length > 0) {
          const valoresVentas = venta_producto.map(v => [nuevaVentaId, v.id_producto, v.cantidad, v.subtotal]);
          await connection.query(
            'INSERT INTO `ventas_productos` ( `id_venta`, `id_producto`, `cantidad`, subtotal) VALUES ?',
            [valoresVentas]
          );
        }

        // Confirmar cambios
        await connection.commit();

        resolve({
          code: 201,
          message: "Venta registrada con éxito",
          result: { id_venta: nuevaVentaId }
        });

      } catch (err) {
        // Si algo falla, deshacemos todo lo anterior
        if (connection) await connection.rollback();

        reject({
          code: err.code || 500,
          message: err.message || "Error al registrar la venta",
          result: err.result || [err]
        });
      } finally {
        // Liberar la conexión de vuelta al pool
        if (connection) connection.release();
      }
    });
  }
  static editar_producto_vendido(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = VentasProductosModel._validarDatosProducto(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `ventas_productos` SET ? WHERE `id_venta_producto`= ?', [actualizar, id])
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
  static eliminar_producto_vendido(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `ventas_productos` WHERE `id_venta_producto` = ?', id)
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

module.exports = VentasProductosModel;