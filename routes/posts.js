const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Crear publicación (requiere autenticación)
router.post('/', isAuthenticated, postsController.createPost);

// Actualizar publicación (requiere autenticación)
router.put('/:id', isAuthenticated, postsController.updatePost);

// Eliminar publicación (requiere autenticación)
router.delete('/:id', isAuthenticated, postsController.deletePost);

// Listado general (público)
router.get('/', postsController.listPosts);

// Vista de artículo individual (público; incrementa contador de vistas)
router.get('/:id', postsController.getPost);

module.exports = router;
