var express = require('express');
var router = express.Router();
const Metodos_Pago_Controller = require('../controllers/metodos_pagos_controllers');

/* (GET) Mostrar todas los métodos */
router.get('/mostrar', (req, res) => {
	Metodos_Pago_Controller.mostrar_metodos_pago()
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar un método por su ID */
router.get('/buscar/:id', (req, res) => {
	Metodos_Pago_Controller.mostrar_metodos_pago_por_id(req.params.id)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar métodos */
router.post('/ingresar', (req, res) => {
	Metodos_Pago_Controller.ingresar_metodo(req.body)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar métodos */
router.put('/editar/:id', function (req, res, next) {
  Metodos_Pago_Controller.editar_metodo(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar métodos por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Metodos_Pago_Controller.eliminar_metodo(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Mostrar todas los categorías */
router.get('/', function (req, res, next) {
  Metodos_Pago_Controller.mostrar_metodos_pago()
    .then((r) => {
      res.render('./metodos_views/metodos', { title: 'Método', metodos_list: r.result });
    })
    .catch(err => res.status(err.code).json(err));
});

/* (POST) */
router.get('/ingresar', function (req, res, next) {
  res.render('./metodos_views/ingresar_metodos', { title: 'Método' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Metodos_Pago_Controller.mostrar_metodos_pago_por_id(req.params.id)
    .then((r) => {
      res.render('./metodos_views/editar_metodos', {
        title: 'Editar Método',
        metodo: r.result[0]
      });
    })
    .catch(err => res.status(err.code).json(err));
});

module.exports = router;