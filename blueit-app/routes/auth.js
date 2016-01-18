var express = require('express');
var router = express.Router();

var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'blueit',
    user: 'SaundieWeiss'
  }
});

/* GET new post. */
router.get('/new', function(req, res, next) {
  // res.send('This will show a form to submit');
  res.render('new', {
    title: 'BlueIT',
    subtitle: 'Submit a new post',
    cookies: req.session.user
  });
});

//POST submit new post.
router.post('/new', function(req, res, next) {
  console.log(req.session.user.user);
  knex('posts')
    .insert({
      title: req.body.title,
      topic: req.body.topic,
      text: req.body.text,
      username: req.session.user.user
    }).then(res.redirect('../'));
});

//GET show individual post
router.get('/:id', function(req, res, next) {
  // console.log(req.params);
  knex('posts')
    .select('title', 'text', 'topic', 'username')
    .where({
      id: req.params.id
    })
    .then(function(post) {
      res.render('entry', {
        post: post[0],
        id: req.params.id,
        cookies: req.session.user,
        user: req.session
      });
    });
});


//GET shows form to update
router.get('/:id/update', function(req, res, next) {
  knex('posts')
    // .select('title', 'text', 'topic')
    .where({
      id: req.params.id
    })
    .then(function(post) {
      res.render('update', {
        title: 'BlueIT',
        subtitle: 'Update your post: ' + post[0].title,
        post: post[0],
        id: req.params.id,
        cookies: req.session.user,
        user: req.session
      });
    });
});

//POST updates the post
router.post('/:id/update', function(req, res, next) {
  knex('posts')
    .where('id', req.params.id)
    .update({
      title: req.body.title,
      topic: req.body.topic,
      text: req.body.text
    })
    .then(function(post) {
      res.redirect('/');
    });
});

//DELETE a user
router.get('/:id/delete', function(req, res, next) {
  // console.log('in post delete');
  knex('posts')
    .where('id', req.params.id)
    .del()
    .then(function(post) {
      res.redirect('/');
    });
});

module.exports = router;
