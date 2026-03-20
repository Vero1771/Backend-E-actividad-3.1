const Ventas_Productos_Model = require('../models/ventas_productos_models');

class VentasProductosController {
  static mostrar_productos_vendidos() {
    return Ventas_Productos_Model.mostrar_productos_vendidos().then(r => r).catch(err => err);
  }
  static mostrar_productos_vendidos_por_id(id) {
    return Ventas_Productos_Model.mostrar_productos_vendidos_por_id(id).then(r => r).catch(err => err);
  }
  static mostrar_productos_vendidos_de_un_usuario(id_usuario) {
    return Ventas_Productos_Model.mostrar_productos_vendidos_de_un_usuario(id_usuario).then(r => r).catch(err => err);
  }
  static ingresar_producto_vendido(venta, venta_producto) {
    return Ventas_Productos_Model.ingresar_producto_vendido(venta, venta_producto).then(r => r).catch(err => err);
  }
  static editar_producto_vendido(id, actualizar) {
    return Ventas_Productos_Model.editar_producto_vendido(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_producto_vendido(id) {
    return Ventas_Productos_Model.eliminar_producto_vendido(id).then(r => r).catch(err => err);
  }
}

module.exports = VentasProductosController;