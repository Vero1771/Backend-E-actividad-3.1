var express = require('express');
var router = express.Router();
const Asientos_Controller = require('../controllers/asientos_controllers');
const { checkLoginAdmin } = require('../auth/auth');

/* (GET) Mostrar todos los asientos */
router.get('/mostrar', checkLoginAdmin, (req, res) => {
  Asientos_Controller.mostrar_asientos()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar un asiento por su ID */
router.get('/buscar/:id', checkLoginAdmin, (req, res) => {
  Asientos_Controller.mostrar_asientos_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar asientos */
router.post('/ingresar', checkLoginAdmin, (req, res) => {
  Asientos_Controller.ingresar_asiento(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar asientos */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Asientos_Controller.editar_asiento(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar asientos por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
  Asientos_Controller.eliminar_asiento(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Todos los asientos */
router.get('/', checkLoginAdmin, function (req, res, next) {
  Asientos_Controller.mostrar_asientos()
    .then((r) => {
      res.render('./asientos_views/asientos', { title: 'Asientos', asientos_list: r.result });
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
  res.render('./asientos_views/ingresar_asientos', { title: 'Asientos' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', checkLoginAdmin, function (req, res, next) {
  Asientos_Controller.mostrar_asientos_por_id(req.params.id)
    .then((r) => {

      if (r.code === 404) {
        return res.status(404).render('error', {
          title: 'Asiento no encontrado',
          code: 404,
          message: r.message
        });
      }

      res.render('./asientos_views/editar_asientos', {
        title: 'Editar Asiento',
        asiento: r.result[0]
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