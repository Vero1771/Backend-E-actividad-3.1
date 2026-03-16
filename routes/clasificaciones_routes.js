var express = require('express');
var router = express.Router();
const Clasificaciones_Controller = require('../controllers/clasificaciones_controllers');
const { checkLoginAdmin } = require('../auth/auth');

/* (GET) Mostrar todas los clasificaciones */
router.get('/mostrar', (req, res) => {
  Clasificaciones_Controller.mostrar_clasificaciones()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una clasificación por su ID */
router.get('/buscar/:id', (req, res) => {
  Clasificaciones_Controller.mostrar_clasificaciones_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar clasificaciones */
router.post('/ingresar', checkLoginAdmin, (req, res) => {
  Clasificaciones_Controller.ingresar_clasificacion(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar clasificaciones */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Clasificaciones_Controller.editar_clasificacion(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar clasificaciones por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
  Clasificaciones_Controller.eliminar_clasificacion(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Mostrar todas los categorías */
router.get('/', function (req, res, next) {
  Clasificaciones_Controller.mostrar_clasificaciones()
    .then((r) => {
      res.render('./clasificaciones_views/clasificaciones', { title: 'Clasificación', clasificaciones_list: r.result });
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
  res.render('./clasificaciones_views/ingresar_clasificaciones', { title: 'Clasificación' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Clasificaciones_Controller.mostrar_clasificaciones_por_id(req.params.id)
    .then((r) => {

      if (r.code === 404) {
        return res.status(404).render('error', {
          title: 'Clasificación no encontrada',
          code: 404,
          message: r.message
        });
      }

      res.render('./clasificaciones_views/editar_clasificaciones', {
        title: 'Editar Clasificación',
        clasificacion: r.result[0]
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