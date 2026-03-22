var express = require('express');
var router = express.Router();
const Usuarios_Controller = require('../controllers/usuarios_controllers');
const { checkLoginUser, checkLoginAdmin } = require('../auth/auth');

/* (GET) Mostrar todas los usuarios */
router.get('/mostrar', checkLoginAdmin, (req, res) => {
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
router.post('/ingresar_admin', checkLoginAdmin, (req, res) => {
  Usuarios_Controller.ingresar_usuario_admin(req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (POST) Login */
router.post('/login', (req, res) => {
  Usuarios_Controller.login(req.body)
    .then(r => {
      if (r.code === 200) {
        res.cookie('token', r.result.token, { 
          httpOnly: true, 
          maxAge: 3600000
        });
        return res.status(200).json(r);
      }
      res.status(r.code).json(r);
    })
    .catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar usuarios */
router.put('/editar/:id', checkLoginAdmin, function (req, res, next) {
  Usuarios_Controller.editar_usuario(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar usuarios por su ID */
router.delete('/eliminar/:id', checkLoginAdmin, function (req, res, next) {
  Usuarios_Controller.eliminar_usuario(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Todos los usuarios */
router.get('/', checkLoginAdmin, function (req, res, next) {
  Usuarios_Controller.mostrar_usuarios()
    .then((r) => {
      res.render('./usuarios_views/usuarios', { title: 'Usuarios', usuarios_list: r.result });
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
  res.render('./usuarios_views/ingresar_usuarios', { title: 'Usuarios' });
});

/* (POST) */
router.get('/ingresar_admin', checkLoginAdmin, function (req, res, next) {
  res.render('./usuarios_views/ingresar_admins', { title: 'Admins' });
});

/* (POST) */
router.get('/login', function (req, res, next) {
  res.render('./usuarios_views/login', { title: 'Login' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', checkLoginAdmin, function (req, res, next) {
  Usuarios_Controller.mostrar_usuarios_por_id(req.params.id)
    .then((r) => {

      if (r.code === 404) {
        return res.status(404).render('error', {
          title: 'Usuario no encontrado',
          code: 404,
          message: r.message
        });
      }

      res.render('./usuarios_views/editar_usuarios', {
        title: 'Editar Usuario',
        usuario: r.result[0]
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

/* (GET) Finalizar sesión */
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Eliminamos la cookie
  res.redirect('/usuarios/login'); // Redirigimos al login
});

module.exports = router;