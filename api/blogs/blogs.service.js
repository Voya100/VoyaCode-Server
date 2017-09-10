module.exports = {
  getBlogs,
  formatBlogResponse,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog
}

const db = require('../../database');
const config = require('../../.config/config');
const formatter = require('../shared/formatter.service');
const emailService = require('../email/email.service')

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
  return db.one('insert into blogs(name, text) values($1, $2) returning id', [name, text]).then((data) => {
    if(config.env === 'production'){
      sendBlogNewsletter(name, data.id);
    }
  });
}

function updateBlog(id, name, text) {
  return db.none('update blogs set name=$1, text=$2 where id=$3',
    [name, text, id]);
}

function deleteBlog(id){
  return db.none('delete from blogs where id=$1', [id]);
}

function sendBlogNewsletter(title, id){
  emailService.sendMail('Voya Code <blogs@voyacode.com>', 'blogs@voyacode.com', 'Voya Code has added new blog: ' + title,
    'Hey,\n\n'
    + 'Voya Code has released a new blog titled "' + title + '". You can read it here: https://voyacode.com/blogs/' + id + '\n\n'
    + 'If you no longer wish to get these emails, you can unsubscribe here: https://voyacode.com/blogs/unsubscribe/%recipient.encodedAddress%',
    {'h:List-Unsubscribe': 'https://voyacode.com/blogs/unsubscribe/%recipient.encodedAddress%'}
  )
}
