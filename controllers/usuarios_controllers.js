const Usuarios_Model = require('../models/usuarios_models');

class UsuariosController {
  static mostrar_usuarios() {
    return Usuarios_Model.mostrar_usuarios().then(r => r).catch(err => err);
  }
  static mostrar_usuarios_por_id(id) {
    return Usuarios_Model.mostrar_usuarios_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_usuario(usuario) {
    return Usuarios_Model.ingresar_usuario(usuario).then(r => r).catch(err => err);
  }
  static ingresar_usuario_admin(usuario) {
    return Usuarios_Model.ingresar_usuario_admin(usuario).then(r => r).catch(err => err);
  }
  static login(usuario) {
    return Usuarios_Model.login(usuario).then(r => r).catch(err => err);
  }
  static editar_usuario(id, actualizar) {
    return Usuarios_Model.editar_usuario(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_usuario(id) {
    return Usuarios_Model.eliminar_usuario(id).then(r => r).catch(err => err);
  }
}

module.exports = UsuariosController;