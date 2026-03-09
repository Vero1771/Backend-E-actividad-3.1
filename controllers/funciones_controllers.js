const Funciones_Model = require('../models/funciones_models');

class FuncionesController {
  static mostrar_funciones() {
    return Funciones_Model.mostrar_funciones().then(r => r).catch(err => err);
  }
  static mostrar_funciones_por_id(id) {
    return Funciones_Model.mostrar_funciones_por_id(id).then(r => r).catch(err => err);
  }
  static mostrar_funciones_recientes() {
    return Funciones_Model.mostrar_funciones_recientes().then(r => r).catch(err => err);
  }
  static ingresar_funcion(funcion) {
    return Funciones_Model.ingresar_funcion(funcion).then(r => r).catch(err => err);
  }
  static editar_funcion(id, actualizar) {
    return Funciones_Model.editar_funcion(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_funcion(id) {
    return Funciones_Model.eliminar_funcion(id).then(r => r).catch(err => err);
  }
}

module.exports = FuncionesController;