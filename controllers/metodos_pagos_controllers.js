const Metodos_Pago_Model = require('../models/metodos_pagos_models');

class MetodosPagoController {
  static mostrar_metodos_pago() {
    return Metodos_Pago_Model.mostrar_metodos_pago().then(r => r).catch(err => err);
  }
  static mostrar_metodos_pago_por_id(id) {
    return Metodos_Pago_Model.mostrar_metodos_pago_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_metodo(metodo) {
    return Metodos_Pago_Model.ingresar_metodo(metodo).then(r => r).catch(err => err);
  }
  static editar_metodo(id, actualizar) {
    return Metodos_Pago_Model.editar_metodo(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_metodo(id) {
    return Metodos_Pago_Model.eliminar_metodo(id).then(r => r).catch(err => err);
  }
}

module.exports = MetodosPagoController;