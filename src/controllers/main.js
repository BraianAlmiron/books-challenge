const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const {Op} = require('sequelize');
const { validationResult } = require('express-validator');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    // Implement look for details in the database
    
    db.Book.findByPk(req.params.id,{include: ['authors']})
    .then((book) => {
      res.render('bookDetail',{book});
    }).catch(error => console.log(error))
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    const { title } = req.body;
    console.log(title)
  
    db.Book.findAll({
      include :['authors'],
      where : {
       title : {[Op.substring]: title}
      }

      
    })
    .then(books => {
      res.render('search', { books });
    })
    .catch(error => {
      console.log(error);
      
  })},
  deleteBook: (req, res) => {
    // Implement delete book
    const {id} = req.params.id;

  // Eliminar todas las filas relacionadas en la tabla "booksauthors"
  db.Author.destroy({
    where: { id: AuthorId }
  })
    .then(() => {
      // Luego de eliminar las filas relacionadas, puedes eliminar el libro
      db.Book.destroy({
        where: { id: bookId }
      })
        .then(() => {
          // Redirige a la página principal o muestra un mensaje de éxito según tus necesidades
          res.redirect('/books');
        })
        .catch((error) => {
          console.log(error);
          // Muestra un error o redirige en caso de algún problema durante la eliminación del libro
          res.status(500).send('Error al eliminar el libro');
        });
    })
    .catch((error) => {
      console.log(error);
      // Muestra un error o redirige en caso de algún problema durante la eliminación de las filas relacionadas
      res.status(500).send('Error al eliminar las filas relacionadas');
    });
},
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    const {id} = req.params
    db.Author.findByPk(id,{include : ['books']})
    .then((author) => {
      res.render('authorBooks', {author});
    })
    .catch(error => console.log(error))
    
  },
  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    const errors = validationResult(req);

    if(errors.isEmpty()) {
      const user = db.User.findOne({
        where : {
          Email: req.body.email
        }
      })
      .then(({Id, CategoryId, Name}) => {
        req.session.userLogin = {
          category : CategoryId,
          Id,
          Name
        };

        if (req.body.remember) {
          res.cookie('booksChallenge', req.session.userLogin, {maxAge: 1000 * 120})
        }

        return res.redirect('/')
      })
      .catch(error => console.log(error))
    }
    else {
      return res.render('login', {
        errors : errors.mapped()
      })
    }
    
  },

  logout: (req,res) => {
    req.session.destroy();
        res.clearCookie('userbooksChallenge');
        return res.redirect('/')
  },
  edit: (req, res) => {
    // Implement edit book
    db.Book.findByPk(req.params.id)
    .then((book) => {
      res.render('editBook', {id: req.params.id, book})
    })
    .catch(error => console.log(error))
    
  },
  processEdit: (req, res) => {
    // Implement edit book
    db.Book.update({
      ...req.body
    },
    {where : {
      id : req.params.id
    }})
    .then(() => res.redirect('/books/detail/' + req.params.id))
      .catch(error => console.log(error));
  }
};

module.exports = mainController;
