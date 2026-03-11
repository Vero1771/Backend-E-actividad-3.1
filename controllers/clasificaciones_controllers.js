const Clasificaciones_Model = require('../models/clasificaciones_models');

class ClasificacionesController {
  static mostrar_clasificaciones() {
    return Clasificaciones_Model.mostrar_clasificaciones().then(r => r).catch(err => err);
  }
  static mostrar_clasificaciones_por_id(id) {
    return Clasificaciones_Model.mostrar_clasificaciones_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_clasificacion(clasificacion) {
    return Clasificaciones_Model.ingresar_clasificacion(clasificacion).then(r => r).catch(err => err);
  }
  static editar_clasificacion(id, actualizar) {
    return Clasificaciones_Model.editar_clasificacion(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_clasificacion(id) {
    return Clasificaciones_Model.eliminar_clasificacion(id).then(r => r).catch(err => err);
  }
}

module.exports = ClasificacionesController;