const express = require('express');
const mainController = require('../controllers/main');

const checkUserLogin = require('../middlewares/checkUserLogin')
const loginUserValidator = require('../validations/loginUserValidator')
const checkUserAdmin = require('../middlewares/checkUserAdmin')

const router = express.Router();

router.get('/', mainController.home);
router.get('/books/detail/:id', mainController.bookDetail);
router.get('/books/search', mainController.bookSearch);
router.post('/books/search', mainController.bookSearchResult);
router.get('/authors', mainController.authors);
router.get('/authors/:id/books', mainController.authorBooks);
router.get('/users/register', mainController.register);
router.post('/users/register', mainController.processRegister);
router.get('/users/login', mainController.login);
router.post('/users/login',loginUserValidator, mainController.processLogin);
router.get('/logout',checkUserLogin,mainController.logout)
router.delete('/books/:id', mainController.deleteBook);
router.get('/books/edit/:id',checkUserAdmin, mainController.edit);
router.post('/books/edit/:id', mainController.processEdit);

module.exports = router;
