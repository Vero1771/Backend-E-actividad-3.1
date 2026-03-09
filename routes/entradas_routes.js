var express = require('express');
var router = express.Router();
const Entradas_Controller = require('../controllers/entradas_controllers');
const Funciones_Controller = require('../controllers/funciones_controllers');
const Asientos_Controller = require('../controllers/asientos_controllers');
const Metodos_Pagos_Controller = require('../controllers/metodos_pagos_controllers');

/* (GET) Mostrar todas las entradas */

router.get('/mostrar', (req, res) => {
  Entradas_Controller.mostrar_entradas()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una entrada por su ID */
router.get('/buscar/:id', (req, res) => {
  Entradas_Controller.mostrar_entradas_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar entradas */
router.post('/ingresar', (req, res) => {
  const { entradas = [], ...datosVenta } = req.body;

  Entradas_Controller.ingresar_entradas(datosVenta, entradas)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err))
});

/* (PUT) Editar entradas */
router.put('/editar/:id', function (req, res, next) {
  Entradas_Controller.editar_entrada(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar entradas por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Entradas_Controller.eliminar_entrada(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Todas las salas */
router.get('/', function (req, res, next) {
  Entradas_Controller.mostrar_entradas()
    .then((r) => {
      res.render('./entradas_views/entradas', { title: 'Entradas', entradas_list: r.result });
    })
    .catch(err => res.status(err.code).json(err));
});

/* (POST) */
router.get('/ingresar', function (req, res, next) {
  Funciones_Controller.mostrar_funciones()
    .then((funciones) => {
      Asientos_Controller.mostrar_asientos()
        .then((asientos) => {
          Metodos_Pagos_Controller.mostrar_metodos_pago()
            .then((metodos_pago) => {
              res.render('./entradas_views/ingresar_entradas', {
                title: 'Entradas',
                funciones_list: funciones.result,
                asientos_list: asientos.result,
                metodos_pago_list: metodos_pago.result,
              });
            })
            .catch(err => res.status(err.code).json(err));
        })
        .catch(err => res.status(err.code).json(err));
    })
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Funciones_Controller.mostrar_funciones()
    .then((funciones) => {
      Asientos_Controller.mostrar_asientos()
        .then((asientos) => {
          Entradas_Controller.mostrar_entradas_por_id(req.params.id)
            .then((r) => {
              res.render('./entradas_views/editar_entradas', {
                title: 'Editar Entrada',
                funciones_list: funciones.result,
                asientos_list: asientos.result,
                entrada: r.result[0]
              });
            })
            .catch(err => res.status(err.code).json(err));
        })
        .catch(err => res.status(err.code).json(err));
    })
    .catch(err => res.status(err.code).json(err));
});

module.exports = router;