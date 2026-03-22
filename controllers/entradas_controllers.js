const Entradas_Model = require('../models/entradas_models');

class EntradasController {
  static mostrar_entradas() {
    return Entradas_Model.mostrar_entradas().then(r => r).catch(err => err);
  }
  static mostrar_entradas_vendidas() {
    return Entradas_Model.mostrar_entradas_vendidas().then(r => r).catch(err => err);
  }
  static mostrar_entradas_no_vendidas() {
    return Entradas_Model.mostrar_entradas_no_vendidas().then(r => r).catch(err => err);
  }
  static mostrar_entradas_por_id(id) {
    return Entradas_Model.mostrar_entradas_por_id(id).then(r => r).catch(err => err);
  }
  static mostrar_entradas_vendidas_de_un_usuario(id_usuario) {
    return Entradas_Model.mostrar_entradas_vendidas_de_un_usuario(id_usuario).then(r => r).catch(err => err);
  }
  static ingresar_entradas(entradas) {
    return Entradas_Model.ingresar_entradas(entradas).then(r => r).catch(err => err);
  }
  static vender_entradas(venta, entradas) {
    return Entradas_Model.vender_entradas(venta, entradas).then(r => r).catch(err => err);
  }
  static editar_entrada(id, actualizar) {
    return Entradas_Model.editar_entrada(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_entrada(id) {
    return Entradas_Model.eliminar_entrada(id).then(r => r).catch(err => err);
  }
}

module.exports = EntradasController;