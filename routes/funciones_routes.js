var express = require('express');
var router = express.Router();
const Funciones_Controller = require('../controllers/funciones_controllers');
const Peliculas_Controller = require('../controllers/peliculas_controllers');
const Salas_Controller = require('../controllers/salas_controllers');
const { checkLoginAdmin } = require('../auth/auth');

/* (GET) Mostrar todas las funciones */
router.get('/mostrar', (req, res) => {
  Funciones_Controller.mostrar_funciones()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una función por su ID */
router.get('/buscar/:id', (req, res) => {
  Funciones_Controller.mostrar_funciones_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Mostrar las últimas 5 funciones recientes */
router.get('/funciones_recientes', (req, res) => {
  Funciones_Controller.mostrar_funciones_recientes()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar funciones */
router.post('/ingresar', checkLoginAdmin, function (req, res, next) {
  Funciones_Controller.ingresar_funcion(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar funciones */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Funciones_Controller.editar_funcion(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar funciones por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
  Funciones_Controller.eliminar_funcion(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});


/* VIEWS EJS */

/* (GET) Todas las Funciones */
router.get('/', function (req, res, next) {
  Funciones_Controller.mostrar_funciones()
    .then((r) => {
      res.render('./funciones_views/funciones', { title: 'Funciones', funciones_list: r.result });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

/* (GET) 5 Funciones Recientes */
router.get('/recientes', function (req, res, next) {
  Funciones_Controller.mostrar_funciones_recientes()
    .then((r) => {
      res.render('./funciones_views/funciones_recientes', { title: 'Funciones', funciones_list: r.result });
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
router.get('/ingresar', checkLoginAdmin, function (req, res, next) {
  Peliculas_Controller.mostrar_peliculas()
    .then((pelis) => {
      Salas_Controller.mostrar_salas()
        .then((salas) => {
          res.render(
            './funciones_views/ingresar_funciones',
            {
              title: 'Función',
              peliculas_list: pelis.result,
              salas_list: salas.result
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
router.get('/actualizar/:id', checkLoginAdmin, function (req, res, next) {
  Funciones_Controller.mostrar_funciones_por_id(req.params.id)
    .then((funcion) => {
      Peliculas_Controller.mostrar_peliculas()
        .then((pelis) => {
          Salas_Controller.mostrar_salas()
            .then((salas) => {

              if (funcion.code === 404) {
                return res.status(404).render('error', {
                  title: 'Función no encontrada',
                  code: 404,
                  message: funcion.message
                });
              }

              res.render(
                './funciones_views/editar_funciones',
                {
                  title: 'Editar Función',
                  peliculas_list: pelis.result,
                  salas_list: salas.result,
                  funcion: funcion.result[0]
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