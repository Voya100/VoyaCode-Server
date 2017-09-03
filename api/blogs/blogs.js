module.exports = {
  getBlogs,
  getBlog,
  getRawBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  previewBlog
};

const db = require('../../database');
const formatter = require('../shared/formatter.service');

function getBlogs(req, res, next) {
  const limit = req.query.limit ? 'LIMIT ' + req.query.limit : '';
  db.any('select * from blogs order by id DESC $1^', limit)
    .then(function (data) {
      data.forEach(formatBlogResponse);
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(next);
}

function getBlog(req, res, next, format=true) {
  const id = parseInt(req.params.id);
  db.one('select * from blogs where id = $1', id)
    .then(function (data) {
      if(format){formatBlogResponse(data)}
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(next);
}

// Returns blog without HTML transformation
function getRawBlog(req, res, next) {
  getBlog(req, res, next, false);
}

function formatBlogResponse(blog){
  blog.year = new Date(blog.date).getFullYear();
  blog.date = formatter.formatDate(blog.date);
  blog.text = formatter.tagsToHtml(blog.text);
}

function addBlog(req, res, next) {

  if(!req.body.name || !req.body.text){
    return next({status: 400, message: 'Invalid arguments'});
  }

  db.none('insert into blogs(name, text)' +
          'values(${name}, ${text})', req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(next);
}

function updateBlog(req, res, next) {
  if(!req.body.name || !req.body.text || !req.params.id){
    return next({status: 400, message: 'Invalid arguments'});
  }

  db.none('update blogs set name=$1, text=$2 where id=$3',
    [req.body.name, req.body.text, parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(next);
}

function deleteBlog(req, res, next){
  db.none('delete from blogs where id=$1', [req.params.id]).then(function(){
    res.status(200).json({status: 'success'});
  }).catch(next);
}

function previewBlog(req, res, next){  
  if(!req.body.name || !req.body.text){
    return next({status: 400, message: 'Invalid arguments'});
  }

  var blog = {name: req.body.name, text: req.body.text, id: req.body.id || 1, date: req.body.date || new Date()};
  formatBlogResponse(blog);
  res.status(200).json({status: 'success', data: blog});
}
