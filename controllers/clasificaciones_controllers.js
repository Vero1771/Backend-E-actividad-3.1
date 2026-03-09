const Clasificaciones_Model = require('../models/clasificaciones_models');

class ClasificacionesController {
  static mostrar_clasificaciones() {
    return Clasificaciones_Model.mostrar_clasificaciones().then(r => r).catch(err => err);
  }
}

module.exports = ClasificacionesController;