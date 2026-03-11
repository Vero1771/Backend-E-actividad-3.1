var express = require('express');
var router = express.Router();
const Peliculas_Controller = require('../controllers/peliculas_controllers');
const Categorias_Controller = require('../controllers/categorias_controllers');
const Clasificaciones_Controller = require('../controllers/clasificaciones_controllers');

/* (GET) Mostrar todas las películas */
router.get('/mostrar', function (req, res, next) {
  Peliculas_Controller.mostrar_peliculas()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Mostrar películas por su ID */
router.get('/buscar/:id', function (req, res, next) {
  Peliculas_Controller.mostrar_peliculas_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar películas */
router.post('/ingresar', function (req, res, next) {
  const { categorias = [], ...datosPelicula } = req.body;

  Peliculas_Controller.ingresar_pelicula(datosPelicula, categorias)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code || 500).json(err));
});

/* (PUT) Editar películas */
router.put('/editar/:id', function (req, res, next) {
  const { categorias, ...datosPelicula } = req.body;
  const id = req.params.id;
  Peliculas_Controller.editar_pelicula(id, datosPelicula, categorias)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code || 500).json(err));
  //res.redirect('/peliculas'); // Redirigir a la lista tras editar
});

/* (DELETE) Eliminar películas por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Peliculas_Controller.eliminar_pelicula(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) */
router.get('/', function (req, res, next) {
  Peliculas_Controller.mostrar_peliculas()
    .then((r) => {
      res.render('./peliculas_views/peliculas', { title: 'Películas', peliculas_list: r.result });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

/* (POST) */
router.get('/ingresar', function (req, res, next) {
  Categorias_Controller.mostrar_categorias()
    .then((categorias) => {
      Clasificaciones_Controller.mostrar_clasificaciones()
        .then((clasificaciones) => {
          res.render(
            './peliculas_views/ingresar_peliculas',
            {
              title: 'Películas',
              categorias_list: categorias.result,
              clasificaciones_list: clasificaciones.result
            }
          );
        })
        .catch(err => {
          res.status(500).render('error', {
            title: 'Error del Servidor',
            code: 500,
            message: 'No pudimos conectar con la base de datos'
          });
        });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Peliculas_Controller.mostrar_peliculas_por_id(req.params.id)
    .then((p) => {
      Categorias_Controller.mostrar_categorias()
        .then((categorias) => {
          Clasificaciones_Controller.mostrar_clasificaciones()
            .then((clasificaciones) => {

              if (p.code === 404) {
                return res.status(404).render('error', {
                  title: 'Película no encontrada',
                  code: 404,
                  message: p.message
                });
              }

              res.render(
                './peliculas_views/editar_peliculas',
                {
                  title: 'Editar Película',
                  peli: p.result[0],
                  categorias_list: categorias.result,
                  clasificaciones_list: clasificaciones.result
                }
              );

            })
            .catch(err => {
              res.status(500).render('error', {
                title: 'Error del Servidor',
                code: 500,
                message: 'No pudimos conectar con la base de datos'
              });
            });
        })
        .catch(err => {
          res.status(500).render('error', {
            title: 'Error del Servidor',
            code: 500,
            message: 'No pudimos conectar con la base de datos'
          });
        });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

module.exports = router;