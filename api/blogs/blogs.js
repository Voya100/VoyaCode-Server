module.exports = {
  getBlogs,
  getBlog,
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

function getBlog(req, res, next) {
  const id = parseInt(req.params.id);
  db.one('select * from blogs where id = $1', id)
    .then(function (data) {
      formatBlogResponse(data);
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(next);
}

function formatBlogResponse(blog){
  blog.date = formatter.formatDate(blog.date);
  blog.text = formatter.tagsToHtml(blog.text);
}

function addBlog(req, res, next) {
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
  var blog = {name: req.body, text: req.body, id: req.body.id || 1, date: new Date()};
  formatBlogResponse(blog);
  res.status(200).json({status: 'success', data: blog});
}
