var express = require('express');
var router = express.Router();
const Productos_Controller = require('../controllers/productos_controllers');
const { checkLoginAdmin } = require('../auth/auth');

/* (GET) Mostrar todos los productos */
router.get('/mostrar', checkLoginAdmin, function (req, res, next) {
  Productos_Controller.mostrar_productos()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Mostrar productos en stock */
router.get('/en_stock', function (req, res, next) {
  Productos_Controller.mostrar_productos_en_stock()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Mostrar productos por su ID */
router.get('/buscar/:id', function (req, res, next) {
  Productos_Controller.mostrar_productos_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar productos */
router.post('/ingresar', checkLoginAdmin, function (req, res, next) {
  Productos_Controller.ingresar_producto(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar productos */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Productos_Controller.editar_producto(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar productos por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
  Productos_Controller.eliminar_producto(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) productos en sotck */
router.get('/', function (req, res, next) {
  Productos_Controller.mostrar_productos_en_stock()
    .then((r) => {
      res.render('./productos_views/productos_en_stock', { title: 'Productos', productos_list: r.result });
    })
    .catch(err => {
      res.status(500).render('error', {
        title: 'Error del Servidor',
        code: 500,
        message: 'No pudimos conectar con la base de datos'
      });
    });
});

/* (GET) Mostrar todos los productos incluso los que no estan en stock */
router.get('/todos', checkLoginAdmin, function (req, res, next) {
  Productos_Controller.mostrar_productos()
    .then((r) => {
      res.render('./productos_views/productos', { title: 'Productos', productos_list: r.result });
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
router.get('/ingresar', checkLoginAdmin, function (req, res, next) {
  res.render('./productos_views/ingresar_productos', { title: 'Productos' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', checkLoginAdmin, function (req, res, next) {
  Productos_Controller.mostrar_productos_por_id(req.params.id)
    .then((r) => {
      
      if (r.code === 404) {
        return res.status(404).render('error', {
          title: 'Producto no encontrado',
          code: 404,
          message: r.message
        });
      }

      res.render('./productos_views/editar_productos', {
        title: 'Editar Producto',
        product: r.result[0]
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