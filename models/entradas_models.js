const pool = require('../db/connection_db');

class EntradasModel {
  static _validarDatosEntrada(entrada) { //Validar una entrada
    const errors = [];
    const camposObligatorios = ['id_funcion', 'id_asiento', 'precio'];
    for (const campo of camposObligatorios) {
      if (entrada[campo] === undefined || entrada[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (isNaN(entrada.id_funcion) || entrada.id_funcion < 0 || isNaN(entrada.id_asiento) || entrada.id_asiento < 0) {
      errors.push("El id de la función, y el id del asiento deben ser números válidos");
    }

    if (isNaN(entrada.precio) || entrada.precio < 0) {
      errors.push("El precio debe ser un número válido");
    }

    return errors;
  }
  static _validarDatosEntradas(entradas) { //Validar varias entradas
    const errors = [];
    let errors_details = [];
    const camposObligatorios = ['id_funcion', 'id_asiento', 'precio'];

    entradas.forEach((entrada, i) => {

      for (const campo of camposObligatorios) {
        if (entrada[campo] === undefined || entrada[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
      }

      if (isNaN(entrada.id_funcion) || entrada.id_funcion < 0 || isNaN(entrada.id_asiento) || entrada.id_asiento < 0) {
        errors.push("El id de la función, y el id del asiento deben ser números válidos");
      }

      if (isNaN(entrada.precio) || entrada.precio < 0) {
        errors.push("El precio debe ser un número válido");
      }

      if (errors_details.length > 0) {
        errors.push({
          id_list_producto: i,
          producto: e,
          errors_details: errors_details
        })
        errors_details = [];
      }
    })

    return errors;
  }
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
  static _calcularTotalVenta(entradas) {
    let total = 0;
    
    entradas.forEach((entrada) => {
      total += entrada.precio;
    })

    return total;
  }
  static mostrar_entradas() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT entradas.id_entrada, peliculas.titulo As "pelicula", salas.nombre As "sala", asientos.id_asiento, asientos.nombre As "asiento", funciones.id_funcion, funciones.fecha_hora As "fecha_funcion", ventas.id_venta, ventas.fecha As "fecha_venta", entradas.precio FROM `entradas` JOIN `funciones` ON entradas.id_funcion = funciones.id_funcion JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala JOIN `asientos` ON entradas.id_asiento = asientos.id_asiento JOIN `ventas` ON entradas.id_venta = ventas.id_venta ORDER BY entradas.id_entrada;')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_entradas_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT entradas.id_entrada, peliculas.titulo As "pelicula", salas.nombre As "sala", asientos.id_asiento, asientos.nombre As "asiento", funciones.id_funcion, funciones.fecha_hora As "fecha_funcion", ventas.id_venta, ventas.fecha As "fecha_venta", entradas.precio FROM `entradas` JOIN `funciones` ON entradas.id_funcion = funciones.id_funcion JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala JOIN `asientos` ON entradas.id_asiento = asientos.id_asiento JOIN `ventas` ON entradas.id_venta = ventas.id_venta WHERE id_entrada = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay entradas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_entradas(venta, entradas) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Obtener la fecha actual
        venta.fecha = new Date();

        // Validar datos 
        const error1 = EntradasModel._validarDatosVenta(venta);
        const error2 = EntradasModel._validarDatosEntradas(entradas);
        const errores = [...error1, ...error2];
        if (errores.length > 0) {
          throw { code: 400, message: "Datos de venta inválidos", result: errores };
        }

        // Calcular el total
        venta.total = EntradasModel._calcularTotalVenta(entradas);

        // Insertar la venta principal
        const [resVenta] = await connection.query('INSERT INTO ventas SET ?', venta);
        const idVenta = resVenta.insertId;

        // Ingresar las entradas
        const valoresEntradas = entradas.map(e => [
          idVenta,
          e.id_funcion,
          e.id_asiento,
          e.precio
        ]);

        await connection.query(
          'INSERT INTO entradas (id_venta, id_funcion, id_asiento, precio) VALUES ?',
          [valoresEntradas]
        );

        await connection.commit();
        resolve({ code: 201, message: "Entradas vendidas con éxito", result: { id_venta: idVenta } });

      } catch (err) {
        if (connection) await connection.rollback();
        reject({ code: 500, message: err.message });
      } finally {
        if (connection) connection.release();
      }
    });
  }
  static editar_entrada(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = EntradasModel._validarDatosEntrada(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      pool.query('UPDATE `entradas` SET ? WHERE `id_entrada`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay entradas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_entrada(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `entradas` WHERE `id_entrada` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay entradas registradas con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
}

module.exports = EntradasModel;