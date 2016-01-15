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
    subtitle: 'Submit a new post'
  });
});

//POST submit new post.
router.post('/new', function(req, res, next) {
  knex('posts')
    .insert({
      title: req.body.title,
      topic: req.body.topic,
      text: req.body.text
    })
    .then(
      res.redirect('../')
    );
});

//GET show individual post
router.get('/:id', function(req, res, next) {
  console.log(req.params);
  knex('posts')
    .select('title', 'text', 'topic')
    .where({
      id: req.params.id
    })
    .then(function(post) {
      res.render('entry', {
        post: post[0]
      });
    });
});

//POST updates the post
router.post('/:id/update', function(req, res, next) {
  knex('posts')
    .update({
      title: req.body.title,
      topic: req.body.topic,
      text: req.body.text
    })
    .where({
      id: req.params.id
    })
    .then(res.redirect('../'));
});



module.exports = router;
