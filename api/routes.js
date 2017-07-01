const request = require('request');
const express = require('express');
const router = express.Router();

var blogs = require('./blogs/blogs')
var comments = require('./comments/comments');

router.get('/blogs', blogs.getBlogs);
router.post('/blogs', blogs.addBlog);
router.get('/blogs/:id', blogs.getBlog);
router.put('/blogs/:id', blogs.updateBlog);

router.get('/test', function(req, res) {
  res.json({test: "This is an api test 3"})
});

router.get('/comments', comments.getComments);
router.post('/comments', comments.commentMessageValidator, comments.postComment);
/*
router.get('/comments', function(req, res){
  const uri = 'http://69.5.14.14/php/getComments.php';
  request({
    uri: uri
  }).pipe(res);
})*/

router.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: err.status || 500,
    message: err.message || err
  });
});

module.exports = router;