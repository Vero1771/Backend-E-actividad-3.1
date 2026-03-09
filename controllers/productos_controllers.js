const Productos_Model = require('../models/productos_models');

class ProductosController {
  static mostrar_productos() {
    return Productos_Model.mostrar_productos().then(r => r).catch(err => err);
  }
  static mostrar_productos_en_stock() {
    return Productos_Model.mostrar_productos_en_stock().then(r => r).catch(err => err);
  }
  static mostrar_productos_por_id(id) {
    return Productos_Model.mostrar_productos_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_producto(producto) {
    return Productos_Model.ingresar_producto(producto).then(r => r).catch(err => err);
  }
  static editar_producto(id, actualizar) {
    return Productos_Model.editar_producto(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_producto(id) {
    return Productos_Model.eliminar_producto(id).then(r => r).catch(err => err);
  }
}

module.exports = ProductosController;