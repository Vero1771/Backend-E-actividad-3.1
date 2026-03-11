var express = require('express');
var router = express.Router();
const Categorias_Controller = require('../controllers/categorias_controllers');

/* (GET) Mostrar todas los categorías */
router.get('/mostrar', (req, res) => {
	Categorias_Controller.mostrar_categorias()
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (GET) Buscar una categoría por su ID */
router.get('/buscar/:id', (req, res) => {
	Categorias_Controller.mostrar_categorias_por_id(req.params.id)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (POST) Ingresar categorías */
router.post('/ingresar', (req, res) => {
	Categorias_Controller.ingresar_categoria(req.body)
		.then(r => res.status(r.code).json(r))
		.catch(err => res.status(err.code).json(err));
});

/* (PUT) Editar categorías */
router.put('/editar/:id', function (req, res, next) {
  Categorias_Controller.editar_categoria(req.params.id, req.body)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* (DELETE) Eliminar categorías por su ID */
router.delete('/eliminar/:id', function (req, res, next) {
  Categorias_Controller.eliminar_categoria(req.params.id)
    .then(r => res.status(r.code).json(r))
    .catch(err => res.status(err.code).json(err));
});

/* VIEWS EJS */

/* (GET) Mostrar todas los categorías */
router.get('/', function (req, res, next) {
  Categorias_Controller.mostrar_categorias()
    .then((r) => {
      res.render('./categorias_views/categorias', { title: 'Categorías', categorias_list: r.result });
    })
    .catch(err => res.status(err.code).json(err));
});

/* (POST) */
router.get('/ingresar', function (req, res, next) {
  res.render('./categorias_views/ingresar_categorias', { title: 'Categorías' });
});

/* (PUT) Mostrar formulario de edición */
router.get('/actualizar/:id', function (req, res, next) {
  Categorias_Controller.mostrar_categorias_por_id(req.params.id)
    .then((r) => {
      res.render('./categorias_views/editar_categorias', {
        title: 'Editar Categoría',
        categoria: r.result[0]
      });
    })
    .catch(err => res.status(err.code).json(err));
});

module.exports = router;