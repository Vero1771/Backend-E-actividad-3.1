var express = require('express');
var router = express.Router();
const Metodos_Pago_Controller = require('../controllers/metodos_pagos_controllers');
const { checkLoginAdmin } = require('../auth/auth');

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
router.post('/ingresar', checkLoginAdmin, (req, res) => {
  Metodos_Pago_Controller.ingresar_metodo(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar métodos */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Metodos_Pago_Controller.editar_metodo(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar métodos por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
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
  res.render('./metodos_views/ingresar_metodos', { title: 'Método' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Metodos_Pago_Controller.mostrar_metodos_pago_por_id(req.params.id)
    .then((r) => {

      if (r.code === 404) {
        return res.status(404).render('error', {
          title: 'Método no encontrado',
          code: 404,
          message: r.message
        });
      }

      res.render('./metodos_views/editar_metodos', {
        title: 'Editar Método',
        metodo: r.result[0]
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