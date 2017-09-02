const express = require('express');
const router = express.Router();

const auth = require('./auth/auth.controller');
const blogs = require('./blogs/blogs');
const comments = require('./comments/comments');

router.post('/login', auth.login);

router.get('/blogs', blogs.getBlogs);
router.post('/blogs', auth.adminAuth, blogs.addBlog);
router.get('/blogs/:id', blogs.getBlog);
router.put('/blogs/:id', auth.adminAuth, blogs.updateBlog);

router.get('/test', function(req, res) {
  res.json({test: "This is an api test 3"})
});

router.get('/comments', comments.getComments);
router.post('/comments', comments.commentMessageValidator, comments.postComment);

router.use(function(err, req, res, next) {
  res.status(err.status || 500)
    .json({
      status: err.status || 500,
      message: err.message || err
    });
});

module.exports = router;