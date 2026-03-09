const Asientos_Model = require('../models/asientos_models');

class AsientosController {
  static mostrar_asientos() {
    return Asientos_Model.mostrar_asientos().then(r => r).catch(err => err);
  }
}

module.exports = AsientosController;