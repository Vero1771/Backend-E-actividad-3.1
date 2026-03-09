const pool = require('../db/connection_db');

class CategoriasModel {
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
}

module.exports = CategoriasModel;