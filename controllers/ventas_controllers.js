const Ventas_Model = require('../models/ventas_models');

class VentasController {
  static mostrar_ventas() {
    return Ventas_Model.mostrar_ventas().then(r => r).catch(err => err);
  }
  static mostrar_ventas_por_id(id) {
    return Ventas_Model.mostrar_ventas_por_id(id).then(r => r).catch(err => err);
  }
  static mostrar_ventas_por_rango(rango) {
    return Ventas_Model.mostrar_ventas_por_rango(rango).then(r => r).catch(err => err);
  }
  static ingresar_venta(venta) {
    return Ventas_Model.ingresar_venta(venta).then(r => r).catch(err => err);
  }
  static editar_venta(id, actualizar) {
    return Ventas_Model.editar_venta(id, actualizar).then(r => r).catch(err => err);
  }
  static eliminar_venta(id) {
    return Ventas_Model.eliminar_venta(id).then(r => r).catch(err => err);
  }
}

module.exports = VentasController;