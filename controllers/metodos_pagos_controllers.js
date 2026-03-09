const Metodos_Pago_Model = require('../models/metodos_pagos_models');

class MetodosPagoController {
  static mostrar_metodos_pago() {
    return Metodos_Pago_Model.mostrar_metodos_pago().then(r => r).catch(err => err);
  }
}

module.exports = MetodosPagoController;