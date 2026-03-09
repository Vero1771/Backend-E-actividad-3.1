const Peliculas_Model = require('../models/peliculas_models');

class PeliculasController {
  static mostrar_peliculas() {
    return Peliculas_Model.mostrar_peliculas().then(r => r).catch(err => err);
  }
  static mostrar_peliculas_por_id(id) {
    return Peliculas_Model.mostrar_peliculas_por_id(id).then(r => r).catch(err => err);
  }
  static ingresar_pelicula(peli, categorias) {
    return Peliculas_Model.ingresar_pelicula(peli, categorias).then(r => r).catch(err => err);
  }
  static editar_pelicula(id, actualizar, categorias) {
    return Peliculas_Model.editar_pelicula(id, actualizar, categorias).then(r => r).catch(err => err);
  }
  static eliminar_pelicula(id) {
    return Peliculas_Model.eliminar_pelicula(id).then(r => r).catch(err => err);
  }
}

module.exports = PeliculasController;