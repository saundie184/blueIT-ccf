var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'blueit',
    user: 'SaundieWeiss'
  }
});

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('newuser', {
    subtitle: 'Create an account',
    cookies: req.session.user

  });
});

//POST users info in knex
router.post('/new', function(req, res, next) {
  //validate that passwords are the same
  if (req.body.password === req.body.passwordconfirm) {
    //hash password
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        // Store hash in your password DB.
        knex('users')
          .insert({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: hash
          }).then(function(user) {
            // console.log('cookies here? ' + user);
            //set cookies
            req.session.user = {
              user: req.body.username
            };
          }).then(res.redirect('/'));
      });
    });
  } else {
    res.send('ERROR: Passwords do not match');
  }
});

//GET route to show sign in form
router.get('/signin', function(req, res, next) {
  res.render('signin', {
    subtitle: 'Sign in!',
    cookies: req.session.user
  });
});

//POST route for authorization
router.post('/signin', function(req, res, next) {
  knex('users')
  .first()
    .where({
      username: req.body.username
    }).then(function(user) {
      // console.log('sign in user is: ' + user.username);
      bcrypt.compare(req.body.password, user.password, function(err, match) {
        if (match) {
          //set cookies
          req.session.user = {
            user: req.body.username
          };
          res.redirect('/');
        } else {
          res.send('ERROR: username or password does not match.');
        }
      });
    });
});


//GET route for signout
router.get('/signout', function(req, res, next) {
  req.session = null;
  knex('posts')
    .select('*')
    // .whereNotNull('title')
    .then(function(posts) {
      res.render('index', {
        title: 'BlueIT',
        subtitle: 'Here\'s what the world is talking about!',
        posts: posts,
        id: posts.id,
        cookies: req.session,
        user: req.session
      });
    });
});




module.exports = router;
