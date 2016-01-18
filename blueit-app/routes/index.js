var express = require('express');
var router = express.Router();
var knex = require('knex')({
  client: 'pg',
  connection: {
    database: 'blueit',
    user: 'SaundieWeiss'
  }
});

/* GET home page where all the posts will show up. */
router.get('/', function(req, res, next) {
  knex('posts')
    .select('*')
    // .whereNotNull('title')
    .then(function(posts) {
      res.render('index', {
        title: 'BlueIT',
        subtitle: 'Here\'s what the world is talking about!',
        posts: posts,
        id: posts.id,
        cookies: req.session.user,
        user: req.session
      });
    });
});

module.exports = router;
