var express = require('express');
var router = express.Router();
const Salas_Controller = require('../controllers/salas_controllers');

/* (GET) Mostrar todas las salas */
router.get('/mostrar', (req, res) => {
	Salas_Controller.mostrar_salas()
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una sala por su ID */
router.get('/buscar/:id', (req, res) => {
	Salas_Controller.mostrar_salas_por_id(req.params.id)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar salas */
router.post('/ingresar', (req, res) => {
	Salas_Controller.ingresar_sala(req.body)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar salas */
router.put('/editar/:id', function (req, res, next) {
  Salas_Controller.editar_sala(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar salas por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Salas_Controller.eliminar_sala(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Todas las salas */
router.get('/', function (req, res, next) {
  Salas_Controller.mostrar_salas()
    .then((r) => {
      res.render('./salas_views/salas', { title: 'Salas', salas_list: r.result });
    })
    .catch(err => res.status(err.code).json(err));
});

/* (POST) */
router.get('/ingresar', function (req, res, next) {
  res.render('./salas_views/ingresar_salas', { title: 'Salas' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Salas_Controller.mostrar_salas_por_id(req.params.id)
    .then((r) => {
      res.render('./salas_views/editar_salas', {
        title: 'Editar Sala',
        sala: r.result[0]
      });
    })
    .catch(err => res.status(err.code).json(err));
});

module.exports = router;