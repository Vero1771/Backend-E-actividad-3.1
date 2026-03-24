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

    if (typeof (usuario.email) !== "string" || usuario.email == "") {
      errors.push("El email del usuario debe ser una cadena de texto");
    }

    if (typeof (usuario.password) !== "string" || usuario.password == "") {
      errors.push("La contraseña del usuario debe ser una cadena de texto");
    }

    return errors;
  }
  static async _verificarEmailUnico(email, idExcluir = null) {
    let query = 'SELECT id_usuario FROM `usuarios` WHERE email = ?';
    let params = [email];

    if (idExcluir) { //Sirve para el caso de editar
      query += ' AND id_usuario != ?';
      params.push(idExcluir);
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0;
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
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnection();

        // Validar datos
        const errors = UsuariosModel._validarDatos(usuario);
        if (errors.length > 0) {
          throw { code: 400, message: "Datos de usuario inválidos", result: errors };
        }

        // Validar si el email ya existe
        const existe = await UsuariosModel._verificarEmailUnico(usuario.email);
        if (existe) {
          throw { code: 409, message: "El correo electrónico ya está registrado", result: [] };
        }

        usuario.rol = "user"; //Asignar rol
        usuario.password = bcrypt.hashSync(usuario.password, saltRounds); //Encriptar clave

        //Insertar
        const [rows] = await connection.query('INSERT INTO `usuarios` SET ?', usuario);

        resolve({ code: 201, message: "Usuario registrado con éxito", result: [rows] });

      } catch (err) {
        reject({
          code: err.code || 500,
          message: err.message || "Error interno del servidor",
          result: err.result || [err]
        });
      } finally {
        if (connection) connection.release();
      }
    });
  }
  static ingresar_usuario_admin(usuario) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnection();
        const errors = UsuariosModel._validarDatos(usuario);
        if (errors.length > 0) throw { code: 400, message: "Datos inválidos", result: errors };

        const existe = await UsuariosModel._verificarEmailUnico(usuario.email);
        if (existe) throw { code: 409, message: "El correo ya existe", result: [] };

        usuario.rol = "admin"; //Asignar rol 
        usuario.password = bcrypt.hashSync(usuario.password, saltRounds); //Encriptar clave

        const [rows] = await connection.query('INSERT INTO `usuarios` SET ?', usuario);
        resolve({ code: 201, message: "Administrador registrado con éxito", result: [rows] });
      } catch (err) {
        reject({ code: err.code || 500, message: err.message, result: err.result || [err] });
      } finally {
        if (connection) connection.release();
      }
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

            reject({ code: 401, message: "Error al ingresar", result: usuario })

          }
          resolve({ code: 404, message: "no hay usuarios registrados con ese email", result: rows })
        })
        .catch(err =>
          reject({ code: 500, message: err.message, result: [err] })
        );
    });
  }
  static editar_usuario(id, actualizar) {
    return new Promise(async (resolve, reject) => {
      let connection;
      try {
        connection = await pool.getConnection();

        const errors = UsuariosModel._validarDatos(actualizar); //Validar datos
        if (errors.length > 0) throw { code: 400, message: "Datos inválidos", result: errors };

        if (actualizar.rol) throw { code: 403, message: "No puedes cambiarte de rol", result: [] };

        // Validar que no exista otro email igual
        const existe = await UsuariosModel._verificarEmailUnico(actualizar.email, id);
        if (existe) throw { code: 409, message: "El nuevo email ya está en uso por otro usuario", result: [] };

        actualizar.password = bcrypt.hashSync(actualizar.password, saltRounds); //Encriptar clave

        const [rows] = await connection.query('UPDATE `usuarios` SET ? WHERE `id_usuario` = ?', [actualizar, id]);

        if (rows.affectedRows > 0) {
          resolve({ code: 200, message: "Usuario actualizado con éxito", result: [rows] });
        } else {
          throw { code: 404, message: "No se encontró el usuario con ese ID", result: [] };
        }

      } catch (err) {
        reject({ code: err.code || 500, message: err.message, result: err.result || [err] });
      } finally {
        if (connection) connection.release();
      }
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