const Asientos_Model = require('../models/asientos_models');

class AsientosController {
  static mostrar_asientos() {
    return Asientos_Model.mostrar_asientos().then(r => r).catch(err => err);
  }
  static mostrar_asientos_por_id(id) {
    return Asientos_Model.mostrar_asientos_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_asiento(asiento) {
    return Asientos_Model.ingresar_asiento(asiento).then(r => r).catch(err => err);
  }
  static editar_asiento(id, actualizar) {
    return Asientos_Model.editar_asiento(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_asiento(id) {
    return Asientos_Model.eliminar_asiento(id).then(r => r).catch(err => err);
  }
}

module.exports = AsientosController;