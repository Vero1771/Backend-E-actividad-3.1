var express = require('express');
var router = express.Router();
const Entradas_Controller = require('../controllers/entradas_controllers');

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

module.exports = router;