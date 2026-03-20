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
  static mostrar_entradas_no_vendidas() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT entradas.id_entrada, entradas.id_venta, peliculas.titulo As "pelicula", salas.nombre As "sala", asientos.id_asiento, asientos.nombre As "asiento", funciones.id_funcion, funciones.fecha_hora As "fecha_funcion", entradas.precio FROM `entradas` JOIN `funciones` ON entradas.id_funcion = funciones.id_funcion JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala JOIN `asientos` ON entradas.id_asiento = asientos.id_asiento WHERE entradas.id_venta IS NULL ORDER BY entradas.id_entrada;')
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
      pool.query('SELECT entradas.id_entrada, entradas.id_venta, peliculas.titulo As "pelicula", salas.nombre As "sala", asientos.id_asiento, asientos.nombre As "asiento", funciones.id_funcion, funciones.fecha_hora As " fecha_funcion", entradas.precio FROM `entradas` JOIN `funciones` ON entradas.id_funcion = funciones.id_funcion JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala JOIN `asientos` ON entradas.id_asiento = asientos.id_asiento WHERE id_entrada = ?', id)
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
  static mostrar_entradas_vendidas_de_un_usuario(id_usuario) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT ventas.id_usuario, entradas.id_entrada, peliculas.titulo As "pelicula", salas.nombre As "sala", asientos.id_asiento, asientos.nombre As "asiento", funciones.id_funcion, funciones.fecha_hora As "fecha_funcion", ventas.id_venta, ventas.fecha As "fecha_venta", entradas.precio FROM `entradas` JOIN `funciones` ON entradas.id_funcion = funciones.id_funcion JOIN `peliculas` ON peliculas.id_pelicula = funciones.id_pelicula JOIN `salas` ON salas.id_sala = funciones.id_sala JOIN `asientos` ON entradas.id_asiento = asientos.id_asiento JOIN `ventas` ON entradas.id_venta = ventas.id_venta WHERE ventas.id_usuario = ?', id_usuario)
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
  static ingresar_entradas(entradas) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Validar datos 
        const errors = EntradasModel._validarDatosEntradas(entradas);
        if (errors.length > 0) {
          throw { code: 400, message: "Datos de entradas inválidos", result: errors };
        }

        // No vender asientos duplicados para la misma función
        const asientosSet = new Set(entradas.map(e => `${e.id_funcion}-${e.id_asiento}`));
        if (asientosSet.size !== entradas.length) {
          throw { code: 400, message: "No puedes vender el mismo asiento varias veces en el mismo pedido" };
        }

        for (const e of entradas) {
          const [existente] = await connection.query(
            'SELECT id_entrada FROM entradas WHERE id_funcion = ? AND id_asiento = ?',
            [e.id_funcion, e.id_asiento]
          );
          if (existente.length > 0) {
            throw { code: 400, message: `El asiento ${e.id_asiento} ya está ocupado para la función ${e.id_funcion}` };
          }
        }

        // Ingresar las entradas
        const valoresEntradas = entradas.map(e => [
          null,
          e.id_funcion,
          e.id_asiento,
          e.precio
        ]);


        await connection.query(
          'INSERT INTO entradas (id_venta, id_funcion, id_asiento, precio) VALUES ?',
          [valoresEntradas]
        );

        await connection.commit();
        resolve({ code: 201, message: "Entradas registradas con éxito", result: [entradas] });

      } catch (err) {
        if (connection) await connection.rollback();
        reject({ code: 500, message: err.message });
      } finally {
        if (connection) connection.release();
      }
    });
  }
  static vender_entradas(venta, entradas) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        venta.fecha = new Date();

        const errors = EntradasModel._validarDatosVenta(venta);
        if (errors.length > 0) {
          throw { code: 400, message: "Datos de venta inválidos", result: errors };
        }

        venta.total = EntradasModel._calcularTotalVenta(entradas);

        //Crear la venta principal
        const [resVenta] = await connection.query('INSERT INTO ventas SET ?', venta);
        const idVenta = resVenta.insertId;

        // Actualizar el ID de ventas de las entradas 
        const promesasActualizacion = entradas.map(e => {
          return connection.query(
            'UPDATE `entradas` SET `id_venta` = ? WHERE `id_entrada` = ?',
            [idVenta, e.id_entrada]
          );
        });

        await Promise.all(promesasActualizacion);

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
    return new Promise(async (resolve, reject) => {

      const error = EntradasModel._validarDatosEntrada(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }

      try {
        // Evitar que se registre el mismo asiento en la misma función
        if (actualizar.id_funcion && actualizar.id_asiento) {
          const [ocupado] = await pool.query(
            'SELECT id_entrada FROM entradas WHERE id_funcion = ? AND id_asiento = ? AND id_entrada != ?',
            [actualizar.id_funcion, actualizar.id_asiento, id]
          );

          if (ocupado.length > 0) {
            return reject({ code: 400, message: "El asiento seleccionado ya está ocupado en esa función" });
          }
        }

        // Proceder con el UPDATE
        const [rows] = await pool.query('UPDATE `entradas` SET ? WHERE `id_entrada`= ?', [actualizar, id]);
        if (rows.affectedRows > 0) {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        }
        resolve({ code: 404, message: "no hay entradas registradas con ese ID", result: rows })

      } catch (err) {
        reject({ code: 500, message: err.message });
      }
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