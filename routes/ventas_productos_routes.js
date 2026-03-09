var express = require('express');
var router = express.Router();
const Ventas_Productos_Controller = require('../controllers/ventas_productos_controllers');

/* (GET) Mostrar todos los productos vendidos */
router.get('/mostrar', function (req, res, next) {
  Ventas_Productos_Controller.mostrar_productos_vendidos()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una venta por su ID */
router.get('/buscar/:id', (req, res) => {
	Ventas_Productos_Controller.mostrar_productos_vendidos_por_id(req.params.id)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar productos vendidos */
router.post('/ingresar', function (req, res, next) {
	const { productos = [], ...datosVenta } = req.body;

  Ventas_Productos_Controller.ingresar_producto_vendido(datosVenta, productos)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar productos vendidos  */
router.put('/editar/:id', function (req, res, next) {
  Ventas_Productos_Controller.editar_producto_vendido(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar productos vendidos por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Ventas_Productos_Controller.eliminar_producto_vendido(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

module.exports = router;