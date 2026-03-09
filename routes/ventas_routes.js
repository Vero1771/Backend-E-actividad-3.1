var express = require('express');
var router = express.Router();
const Ventas_Controller = require('../controllers/ventas_controllers');
const Metodos_Pagos_Controller = require('../controllers/metodos_pagos_controllers');

/* (GET) Mostrar todas las ventas */
router.get('/mostrar', (req, res) => {
  Ventas_Controller.mostrar_ventas()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una sala por su ID */
router.get('/buscar/:id', (req, res) => {
  Ventas_Controller.mostrar_ventas_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Mostrar ventas en un rango de fecha */
router.get('/rango', function (req, res, next) {
  Ventas_Controller.mostrar_ventas_por_rango(req.query)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar ventas */
router.post('/ingresar', function (req, res, next) {
  Ventas_Controller.ingresar_venta(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar ventas */
router.put('/editar/:id', function (req, res, next) {
  Ventas_Controller.editar_venta(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar ventas por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Ventas_Controller.eliminar_venta(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Todas las ventas */
router.get('/', function (req, res, next) {
  Ventas_Controller.mostrar_ventas()
    .then((r) => {
      res.render('./ventas_views/ventas', { title: 'Ventas', ventas_list: r.result });
    })
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Vista de ventas filtradas por rango */
router.get('/ver-rango', function (req, res) {
  const { inicio, fin } = req.query;

  if (!inicio || !fin) {
    return res.render('./ventas_views/ventas_rango', {
      title: 'Filtrar Ventas',
      ventas_list: [],
      error_msg: null
    });
  }

  Ventas_Controller.mostrar_ventas_por_rango(req.query)
    .then((r) => {
      res.render('./ventas_views/ventas_rango', {
        title: `Ventas del ${inicio} al ${fin}`,
        ventas_list: r.result,
        error_msg: null
      });
    })
    .catch(err => {
      res.render('./ventas_views/ventas_rango', {
        title: 'Error en el Rango',
        ventas_list: [],
        error_msg: err.message || "Error desconocido al filtrar fechas"
      });
    });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Metodos_Pagos_Controller.mostrar_metodos_pago()
    .then((metodos_pago) => {
      Ventas_Controller.mostrar_ventas_por_id(req.params.id)
        .then((r) => {
          res.render('./ventas_views/editar_ventas', {
            title: 'Editar Venta',
            metodos_pago_list: metodos_pago.result,
            venta: r.result[0]
          });
        })
        .catch(err => res.status(err.code).json(err));
    })
    .catch(err => res.status(err.code).json(err));
});

module.exports = router;