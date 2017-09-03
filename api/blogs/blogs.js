var db = require('../../database');
var moment = require('moment-timezone');

function getBlogs(req, res, next) {
  var limit = req.query.limit ? 'LIMIT ' + req.query.limit : '';
  db.any('select * from blogs order by id DESC $1^', limit)
    .then(function (data) {
      data.forEach(parseBlogData);
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
      parseBlogData(data);
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

function parseBlogData(data){
  data.date = moment(data.date).tz('Europe/Helsinki').format('DD.MM.YYYY');
}

function addBlog(req, res, next) {
  parseBlogContent(req.body);
  db.none('insert into blogs(name, text)' +
          'values(${name}, ${text})', req.body)
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

function parseBlogContent(data){
  data.text = data.text.replace(/\n/g, "<br>");
}

function updateBlog(req, res, next) {
  parseBlogContent(req.body);
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
  parseBlogContent(blog);
  parseBlogData(blog);
  res.status(200).json(blog);
}

module.exports = {
  getBlogs,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  previewBlog
};
