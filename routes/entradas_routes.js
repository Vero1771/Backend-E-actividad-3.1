var express = require('express');
var router = express.Router();
const Entradas_Controller = require('../controllers/entradas_controllers');
const Funciones_Controller = require('../controllers/funciones_controllers');
const Asientos_Controller = require('../controllers/asientos_controllers');
const Metodos_Pagos_Controller = require('../controllers/metodos_pagos_controllers');
const { checkLoginUser, checkLoginAdmin, checkLoginView } = require('../auth/auth');

/* (GET) Mostrar todas las entradas */
router.get('/mostrar', (req, res) => {
  Entradas_Controller.mostrar_entradas()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Mostrar todas las entradas sin vender */
router.get('/no_vendidas', (req, res) => {
  Entradas_Controller.mostrar_entradas_no_vendidas()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una entrada por su ID */
router.get('/buscar/:id', (req, res) => {
  Entradas_Controller.mostrar_entradas_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) las compras de un usuario */
router.get('/tus_compras', checkLoginUser, (req, res) => {
  Entradas_Controller.mostrar_entradas_vendidas_de_un_usuario(req.usuario.id_usuario)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar entradas */
router.post('/ingresar', checkLoginAdmin, (req, res) => {
  const { entradas = [] } = req.body;
  Entradas_Controller.ingresar_entradas(entradas)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err))
});

/* (PUT) Vender entradas */
router.put('/vender', checkLoginUser, (req, res) => {
  const { entradas = [], ...datosVenta } = req.body;
  datosVenta.id_usuario = req.usuario.id_usuario;

  Entradas_Controller.vender_entradas(datosVenta, entradas)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err))
});

/* (PUT) Editar entradas */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Entradas_Controller.editar_entrada(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar entradas por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
  Entradas_Controller.eliminar_entrada(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Todas las entradas */
router.get('/', function (req, res, next) {
  Entradas_Controller.mostrar_entradas()
    .then((r) => {
      res.render('./entradas_views/entradas', { title: 'Entradas', entradas_list: r.result });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

/* (GET) Todas las entradas compradas de un usuario */
router.get('/tus_entradas', checkLoginView, function (req, res, next) {
  const id_usuario = req.usuario.id_usuario;
  Entradas_Controller.mostrar_entradas_vendidas_de_un_usuario(id_usuario)
    .then((r) => {
      res.render('./entradas_views/tus_entradas', { title: 'Tus Entradas', entradas_list: r.result });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

/* (GET) Entradas sin vender */
router.get('/sin_vender', function (req, res, next) {
  Entradas_Controller.mostrar_entradas_no_vendidas()
    .then((r) => {
      res.render('./entradas_views/entradas_sin_vender', { title: 'Entradas sin Vender', entradas_list: r.result });
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
  Funciones_Controller.mostrar_funciones()
    .then((funciones) => {
      Asientos_Controller.mostrar_asientos()
        .then((asientos) => {
          res.render('./entradas_views/ingresar_entradas', {
            title: 'Entradas',
            funciones_list: funciones.result,
            asientos_list: asientos.result
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

/* (PUT) Comprar entradas */
router.get('/comprar', function (req, res, next) {
  Entradas_Controller.mostrar_entradas_no_vendidas()
    .then((productos) => {
      Metodos_Pagos_Controller.mostrar_metodos_pago()
        .then((metodos_pago) => {
          res.render('./entradas_views/comprar_entradas', {
            title: 'Comprar Entradas',
            entradas_list: productos.result,
            metodos_pago_list: metodos_pago.result,
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

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Funciones_Controller.mostrar_funciones()
    .then((funciones) => {
      Asientos_Controller.mostrar_asientos()
        .then((asientos) => {
          Entradas_Controller.mostrar_entradas_por_id(req.params.id)
            .then((r) => {

              if (r.code === 404) {
                return res.status(404).render('error', {
                  title: 'Entrada no encontrada',
                  code: 404,
                  message: r.message
                });
              }

              res.render('./entradas_views/editar_entradas', {
                title: 'Editar Entrada',
                funciones_list: funciones.result,
                asientos_list: asientos.result,
                entrada: r.result[0]
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