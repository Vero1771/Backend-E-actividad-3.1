const Categorias_Model = require('../models/categorias_models');

class CategoriasController {
  static mostrar_categorias() {
    return Categorias_Model.mostrar_categorias().then(r => r).catch(err => err);
  }
}

module.exports = CategoriasController;