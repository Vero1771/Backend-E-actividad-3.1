const Salas_Model = require('../models/salas_models');

class SalasController {
  static mostrar_salas() {
    return Salas_Model.mostrar_salas().then(r => r).catch(err => err);
  }
  static mostrar_salas_por_id(id) {
    return Salas_Model.mostrar_salas_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_sala(sala) {
    return Salas_Model.ingresar_sala(sala).then(r => r).catch(err => err);
  }
  static editar_sala(id, actualizar) {
    return Salas_Model.editar_sala(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_sala(id) {
    return Salas_Model.eliminar_sala(id).then(r => r).catch(err => err);
  }
}

module.exports = SalasController;