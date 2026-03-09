const pool = require('../db/connection_db');

class MetodosPagoModel {
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
}

module.exports = MetodosPagoModel;