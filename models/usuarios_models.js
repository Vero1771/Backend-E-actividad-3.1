const pool = require('../db/connection_db');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UsuariosModel {
  static _validarDatos(usuario) {
    const errors = [];
    const camposObligatorios = ['email', 'password'];
    for (const campo of camposObligatorios) {
      if (usuario[campo] === undefined || usuario[campo] === null) errors.push(`El campo ${campo} es obligatorio`);
    }

    if (typeof (usuario.email) !== "string") {
      errors.push("El email del usuario debe ser una cadena de texto");
    }

    if (typeof (usuario.password) !== "string") {
      errors.push("La contraseña del usuario debe ser una cadena de texto");
    }

    return errors;
  }
  static mostrar_usuarios() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT `id_usuario`, `email`, `rol` FROM `usuarios`')
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static mostrar_usuarios_por_id(id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT `id_usuario`, `email`, `rol` FROM `usuarios` WHERE id_usuario = ?', id)
        .then(([rows]) => {
          if (rows.length > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay usuarios registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_usuario(usuario) {
    return new Promise((resolve, reject) => {
      const error = UsuariosModel._validarDatos(usuario);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }

      usuario.rol = "user"; //Asignar rol
      usuario.password = bcrypt.hashSync(usuario.password, saltRounds); //Encriptar clave

      pool.query('INSERT INTO `usuarios` SET ?', usuario)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static ingresar_usuario_admin(usuario) {
    return new Promise((resolve, reject) => {
      const error = UsuariosModel._validarDatos(usuario);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }

      usuario.rol = "admin"; //Asignar rol
      usuario.password = bcrypt.hashSync(usuario.password, saltRounds); //Encriptar clave

      pool.query('INSERT INTO `usuarios` SET ?', usuario)
        .then(([rows]) => {
          resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static login(usuario) {
    return new Promise((resolve, reject) => {

      const error = UsuariosModel._validarDatos(usuario);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }

      pool.query('SELECT * FROM `usuarios` WHERE email = ?', usuario.email)
        .then(([rows]) => {
          if (rows.length > 0) {

            if (bcrypt.compareSync(usuario.password, rows[0].password)) {
              let token = jwt.sign(
                { id_usuario: rows[0].id_usuario, email: rows[0].email, rol: rows[0].rol },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );

              let userData = { id_usuario: rows[0].id_usuario, email: rows[0].email, rol: rows[0].rol, token: token }

              resolve({ code: 200, message: "consulta completada con éxito", result: userData })
            }   

            resolve({ code: 401, message: "La contraseña del usuario es incorrecta", result: usuario })

          }
          resolve({ code: 404, message: "no hay usuarios registrados con ese email", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_usuario(id, actualizar) {
    return new Promise((resolve, reject) => {
      const error = UsuariosModel._validarDatos(actualizar);
      if (error.length > 0) {
        reject({ code: 400, message: "Ha ocurrido un problema al ingresar los datos", result: error })
        return;
      }
      if (actualizar.rol) {
        reject({ code: 500, message: 'No puedes cambiarte de rol', result: [] })
        return;
      }

      actualizar.password = bcrypt.hashSync(actualizar.password, saltRounds); //Encriptar clave

      pool.query('UPDATE `usuarios` SET ? WHERE `id_usuario`= ?', [actualizar, id])
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: [rows] })
          }
          resolve({ code: 404, message: "no hay usuarios registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static eliminar_usuario(id) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM `usuarios` WHERE `id_usuario` = ?', id)
        .then(([rows]) => {
          if (rows.affectedRows > 0) {
            resolve({ code: 200, message: "consulta completada con éxito", result: rows })
          }
          resolve({ code: 404, message: "no hay usuarios registrados con ese ID", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
}

module.exports = UsuariosModel;