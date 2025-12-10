const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ArticleController = require('../controllers/ArticleController');
const CommentController = require('../controllers/CommentController');
const ProfileController = require('../controllers/ProfileController'); // 新增
const authMiddleware = require('../middleware/auth');
const authOptional = require('../middleware/authOptional'); // 新增
router.post('/users', userController.register);
router.post('/users/login', userController.login);
router.get('/user', authMiddleware, userController.getCurrentUser);
router.put('/user', authMiddleware, userController.updateUser);
router.post('/articles', authMiddleware, ArticleController.createArticle);
router.get('/articles', ArticleController.listArticles);
router.get('/articles/feed', authMiddleware, ArticleController.feedArticles);
router.get('/articles/:slug', ArticleController.getArticle);
router.put('/articles/:slug', authMiddleware, ArticleController.updateArticle);
router.delete('/articles/:slug', authMiddleware, ArticleController.deleteArticles);
router.post('/articles/:slug/favorite', authMiddleware, ArticleController.favoriteArticle);
router.delete('/articles/:slug/favorite', authMiddleware, ArticleController.unfavoriteArticle);
router.post('/articles/:slug/comments', authMiddleware, CommentController.addComment);
router.get('/articles/:slug/comments', CommentController.getComments);
router.delete('/articles/:slug/comments/:id', authMiddleware, CommentController.deleteComment);
router.get('/profiles/:username', authOptional, ProfileController.getProfile);
router.post('/profiles/:username/follow', authMiddleware, ProfileController.followUser);
router.delete('/profiles/:username/follow', authMiddleware, ProfileController.unfollowUser);
router.get('/tags', ArticleController.getTags);
module.exports = router;