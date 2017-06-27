const request = require('request');
const express = require('express');
const router = express.Router();

var blogs = require('./blogs/blogs')

router.get('/blogs2', blogs.getBlogs);
router.post('/blogs2', blogs.addBlog);
router.get('/blogs2/:id', blogs.getBlog);
router.put('/blogs2/:id', blogs.updateBlog);

router.get('/test', function(req, res) {
  res.json({test: "This is an api test 3"})
});

router.get('/blogs', function(req, res) {
  const uri = 'http://69.5.14.14/php/blogs.php' + (req.query.limit ? '?limit=' + req.query.limit : '');
  request({
    uri: uri
  }).pipe(res);
});

router.get('/comments', function(req, res){
  const uri = 'http://69.5.14.14/php/getComments.php';
  request({
    uri: uri
  }).pipe(res);
})

module.exports = router;