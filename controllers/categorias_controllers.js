const Categorias_Model = require('../models/categorias_models');

class CategoriasController {
  static mostrar_categorias() {
    return Categorias_Model.mostrar_categorias().then(r => r).catch(err => err);
  }
  static mostrar_categorias_por_id(id) {
    return Categorias_Model.mostrar_categorias_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_categoria(categoria) {
    return Categorias_Model.ingresar_categoria(categoria).then(r => r).catch(err => err);
  }
  static editar_categoria(id, actualizar) {
    return Categorias_Model.editar_categoria(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_categoria(id) {
    return Categorias_Model.eliminar_categoria(id).then(r => r).catch(err => err);
  }
}

module.exports = CategoriasController;