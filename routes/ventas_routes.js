var express = require('express');
var router = express.Router();
const Ventas_Controller = require('../controllers/ventas_controllers');

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


module.exports = router;