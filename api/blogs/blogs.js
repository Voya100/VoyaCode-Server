var db = require('../../database');

function getBlogs(req, res, next) {
  var limit = req.query.limit ? 'LIMIT ' + req.query.limit : '';
  db.any('select * from blogs order by id DESC $1^', limit)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
}

function getBlog(req, res, next) {
  var id = parseInt(req.params.id);
  db.one('select * from blogs where id = $1', id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function addBlog(req, res, next) {
  
  db.none('insert into blogs(name, text)' +
      'values(${name}, ${text})',
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success'
        });
    })
    .catch(function (err) {
      console.log(err);
      return next(err);
    });
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
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getBlogs: getBlogs,
  getBlog: getBlog,
  addBlog: addBlog,
  updateBlog: updateBlog
};
