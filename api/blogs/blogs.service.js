module.exports = {
  getBlogs,
  formatBlogResponse,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog
}

const db = require('../../database');
const formatter = require('../shared/formatter.service');

function getBlogs(limit, formatted=true){
  const limitQuery = limit ? 'LIMIT ' + limit : '';
  return db.any('select * from blogs order by id DESC $1^', limitQuery).then((blogs) => {
    if(formatted){
      blogs.forEach(formatBlogResponse);
    }
    return blogs;
  });
}

function formatBlogResponse(blog){
  blog.year = new Date(blog.date).getFullYear();
  blog.date = formatter.formatDate(blog.date);
  blog.text = formatter.tagsToHtml(blog.text);
}

function getBlog(id, formatted=true) {
  return db.one('select * from blogs where id = $1', id).then(function (data) {
    if(formatted){formatBlogResponse(data)}
    return data;
  });
}

function addBlog(name, text) {
  return db.none('insert into blogs(name, text) values($1, $2)', [name, text]);
}

function updateBlog(id, name, text) {
  return db.none('update blogs set name=$1, text=$2 where id=$3',
    [name, text, id]);
}

function deleteBlog(id){
  return db.none('delete from blogs where id=$1', [id]);
}
