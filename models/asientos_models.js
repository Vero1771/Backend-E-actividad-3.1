const pool = require('../db/connection_db');

class AsientosModel {
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
}

module.exports = AsientosModel;