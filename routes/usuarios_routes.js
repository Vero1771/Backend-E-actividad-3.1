var express = require('express');
var router = express.Router();
const Usuarios_Controller = require('../controllers/usuarios_controllers');

/* (GET) Mostrar todas los usuarios */
router.get('/mostrar', (req, res) => {
  Usuarios_Controller.mostrar_usuarios()
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar un usuario por su ID */
router.get('/buscar/:id', (req, res) => {
  Usuarios_Controller.mostrar_usuarios_por_id(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar usuarios */
router.post('/ingresar', (req, res) => {
  Usuarios_Controller.ingresar_usuario(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar admins */
router.post('/ingresar_admin', (req, res) => {
  Usuarios_Controller.ingresar_usuario_admin(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Login */
router.post('/login', (req, res) => {
  Usuarios_Controller.login(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar usuarios */
router.put('/editar/:id', function (req, res, next) {
  Usuarios_Controller.editar_usuario(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar usuarios por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Usuarios_Controller.eliminar_usuario(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

module.exports = router;