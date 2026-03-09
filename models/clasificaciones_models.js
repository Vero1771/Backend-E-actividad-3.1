const pool = require('../db/connection_db');

class ClasificacionesModel {
  static mostrar_clasificaciones() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM `clasificacion_peliculas`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
}

module.exports = ClasificacionesModel;