module.exports = {
  getBlogs,
  getBlog,
  getRawBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  previewBlog
};

const blogService = require('./blogs.service');

function getBlogs(req, res, next) {
  const limit = +req.query.limit;
  blogService.getBlogs(limit, true).then((blogs) => {
    res.status(200).json({ status: 'success', data: blogs  });
  })
  .catch(next);
}

function getBlog(req, res, next, formatted=true) {
  const id = +req.params.id;
  blogService.getBlog(id, formatted).then(function (data) {
    res.status(200).json({ status: 'success', data });
  })
  .catch(next);
}

// Returns blog without HTML transformation
function getRawBlog(req, res, next) {
  getBlog(req, res, next, false);
}

function addBlog(req, res, next) {

  if(!req.body.name || !req.body.text){
    return next({status: 400, message: 'Invalid arguments'});
  }

  blogService.addBlog(req.body.name, req.body.text).then(function () {
    res.status(200).json({ status: 'success' });
  })
  .catch(next);
}

function updateBlog(req, res, next) {
  if(!req.body.name || !req.body.text || !req.params.id){
    return next({status: 400, message: 'Invalid arguments'});
  }

  blogService.updateBlog(+req.params.id, req.body.name, req.body.text).then(function () {
    res.status(200).json({ status: 'success' });
  })
  .catch(next);
}

function deleteBlog(req, res, next){
  blogService.deleteBlog(req.params.id).then(function(){
    res.status(200).json({ status: 'success' });
  })
  .catch(next);
}

function previewBlog(req, res, next){  
  if(!req.body.name || !req.body.text){
    return next({status: 400, message: 'Invalid arguments'});
  }

  var blog = {name: req.body.name, text: req.body.text, id: req.body.id || 1, date: req.body.date || new Date()};
  blogService.formatBlogResponse(blog);
  res.status(200).json({status: 'success', data: blog});
}
