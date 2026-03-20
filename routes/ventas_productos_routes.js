var express = require('express');
var router = express.Router();
const Ventas_Productos_Controller = require('../controllers/ventas_productos_controllers');
const Productos_Controller = require('../controllers/productos_controllers');
const Metodos_Pagos_Controller = require('../controllers/metodos_pagos_controllers');
const { checkLoginUser, checkLoginAdmin, checkLoginView } = require('../auth/auth');

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

/* (GET) Mostrar las compras de un usuario */
router.get('/tus_compras', checkLoginUser, function (req, res, next) {
  Ventas_Productos_Controller.mostrar_productos_vendidos_de_un_usuario(req.usuario.id_usuario)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar productos vendidos */
router.post('/ingresar', checkLoginUser, function (req, res, next) {
  const { productos = [], ...datosVenta } = req.body;
  datosVenta.id_usuario = req.usuario.id_usuario;

  Ventas_Productos_Controller.ingresar_producto_vendido(datosVenta, productos)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar productos vendidos  */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Ventas_Productos_Controller.editar_producto_vendido(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar productos vendidos por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
  Ventas_Productos_Controller.eliminar_producto_vendido(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Todas las ventas */
router.get('/', function (req, res, next) {
  Ventas_Productos_Controller.mostrar_productos_vendidos()
    .then((r) => {
      res.render('./ventas_views/ventas_productos', { title: 'Ventas de Productos', ventas_list: r.result });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});


/* (GET) Todas las compras de un usuario */
router.get('/tus_productos', checkLoginView, function (req, res, next) {
  const id_usuario = req.usuario.id_usuario;
  Ventas_Productos_Controller.mostrar_productos_vendidos_de_un_usuario(id_usuario)
    .then((r) => {
      res.render('./ventas_views/tus_productos', { title: 'Tus Productos', ventas_list: r.result });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

/* (POST) Comprar producto */
router.get('/ingresar', function (req, res, next) {
  Productos_Controller.mostrar_productos_en_stock()
    .then((productos) => {
      Metodos_Pagos_Controller.mostrar_metodos_pago()
        .then((metodos_pago) => {
          res.render('./productos_views/comprar_productos', {
            title: 'Comprar Productos',
            productos_list: productos.result,
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
  Productos_Controller.mostrar_productos()
    .then((productos) => {
      Ventas_Productos_Controller.mostrar_productos_vendidos_por_id(req.params.id)
        .then((r) => {

          if (r.code === 404) {
            return res.status(404).render('error', {
              title: 'Venta no encontrada',
              code: 404,
              message: r.message
            });
          }

          res.render('./ventas_views/editar_ventas_productos', {
            title: 'Editar Venta',
            productos_list: productos.result,
            venta: r.result[0]
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