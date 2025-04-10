const { NormalPost, VideoPost } = require('../models/Post');

// Arreglo en memoria para almacenar las publicaciones y un contador de ID.
let posts = [];
let currentId = 1;

exports.createPost = (req, res) => {
    new Promise((resolve, reject) => {
        let { type, title, subtitle, publicationDate, author, body, videoUrl, bibliographicLinks } = req.body;
        
        if (!title || !subtitle || !publicationDate || !author) {
            return reject({ code: 400, message: 'Faltan datos obligatorios.' });
        }

        let post;
        if (type === 'video') {
            if (!videoUrl) {
                return reject({ code: 400, message: 'El enlace de video es obligatorio para publicaciones de tipo VIDEO.' });
            }
            post = new VideoPost(currentId++, title, subtitle, publicationDate, author, videoUrl, bibliographicLinks);
        } else { 
            // Por defecto se crea una publicación normal
            if (!body) {
                return reject({ code: 400, message: 'El cuerpo de la publicación es obligatorio para publicaciones normales.' });
            }
            post = new NormalPost(currentId++, title, subtitle, publicationDate, author, body, bibliographicLinks);
        }
        posts.push(post);
        resolve(post);
    }).then(post => {
        res.status(201).json(post);
    }).catch(err => {
        res.status(err.code || 500).json({ error: err.message || 'Error interno del servidor.' });
    });
};

exports.updatePost = (req, res) => {
    new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
        const index = posts.findIndex(p => p.id === id);
        if (index === -1) {
            return reject({ code: 404, message: 'Publicación no encontrada.' });
        }
        let existingPost = posts[index];
        const { title, subtitle, publicationDate, author, body, videoUrl, bibliographicLinks } = req.body;
        
        // Actualización de campos comunes
        if (title) existingPost.title = title;
        if (subtitle) existingPost.subtitle = subtitle;
        if (publicationDate) existingPost.publicationDate = publicationDate;
        if (author) existingPost.author = author;
        if (bibliographicLinks !== undefined) existingPost.bibliographicLinks = bibliographicLinks;
        
        // Actualizar según el tipo de publicación
        if (existingPost.type === 'video') {
            if (videoUrl) {
                existingPost.videoUrl = videoUrl;
            } else {
                return reject({ code: 400, message: 'Para publicaciones de tipo VIDEO, el enlace de video es obligatorio.' });
            }
        } else {
            if (body) {
                existingPost.body = body;
            } else {
                return reject({ code: 400, message: 'Para publicaciones normales, el cuerpo de la publicación es obligatorio.' });
            }
        }
        posts[index] = existingPost;
        resolve(existingPost);
    }).then(updatedPost => {
        res.json(updatedPost);
    }).catch(err => {
        res.status(err.code || 500).json({ error: err.message || 'Error interno del servidor.' });
    });
};

exports.deletePost = (req, res) => {
    new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
        const index = posts.findIndex(p => p.id === id);
        if (index === -1) {
            return reject({ code: 404, message: 'Publicación no encontrada.' });
        }
        posts.splice(index, 1);
        resolve();
    }).then(() => {
        res.json({ message: 'Publicación eliminada exitosamente.' });
    }).catch(err => {
        res.status(err.code || 500).json({ error: err.message || 'Error interno del servidor.' });
    });
};

exports.listPosts = (req, res) => {
    new Promise((resolve) => {
        // Ordenar publicaciones: de la fecha más reciente a la más antigua
        let sortedPosts = posts.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
        // Paginación: 10 publicaciones por página.
        let page = parseInt(req.query.page) || 1;
        let limit = 10;
        let startIndex = (page - 1) * limit;
        let endIndex = startIndex + limit;
        // Se elimina la información completa (cuerpo o videoUrl) para mantener el listado resumido.
        let postsSummary = sortedPosts.slice(startIndex, endIndex).map(p => {
            const { id, title, subtitle, publicationDate, author, bibliographicLinks, type, views } = p;
            return { id, title, subtitle, publicationDate, author, bibliographicLinks, type, views };
        });
        resolve({
            page,
            totalPages: Math.ceil(sortedPosts.length / limit),
            totalPosts: sortedPosts.length,
            posts: postsSummary
        });
    }).then(result => {
        res.json(result);
    });
};

exports.getPost = (req, res) => {
    new Promise((resolve, reject) => {
        const id = parseInt(req.params.id);
        let post = posts.find(p => p.id === id);
        if (!post) {
            return reject({ code: 404, message: 'Publicación no encontrada.' });
        }
        // Incrementar contador de visualizaciones
        post.views += 1;
        resolve(post);
    }).then(post => {
        res.json(post);
    }).catch(err => {
        res.status(err.code || 500).json({ error: err.message || 'Error interno del servidor.' });
    });
};
