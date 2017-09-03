const db = require('../../database');
const moment = require('moment-timezone');

const formatter = require('../shared/formatter.service');

function getComments(req, res, next) {
  var admin = req.user.admin;
  var filterPrivate = admin ? '' : 'WHERE private=false';
  db.any('select id, username, message, private, post_time, update_time from comments $1^ ORDER BY id ASC', filterPrivate)
    .then(function (data) {
      data = data.map(comment => {
        comment.post_time = moment.unix(comment.post_time).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm');
        comment.update_time = moment.unix(comment.update_time).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm');
        return comment;
      })
  
      res.status(200)
        .json({
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function commentMessageValidator(req, res, next){
  validateUsername(req, res, next);
  validateMessage(req, res, next);
  replaceTags(req, res, next);
  next();
}

var forbiddenUsernames = ['voya', 'admin'];
function validateUsername(req, res, next){
  var name = req.body.username.toLowerCase();
  if(forbiddenUsernames.indexOf(name) != -1){
    return next({status: 400, message: "Username is forbidden, use another."})
  }else if(name.length < 4 || 15 < name.length){
    return next({status: 400, message: "Username must be 4 - 15 characters long."});
  }
}

function validateMessage(req, res, next){
  var message = req.body.message;
  if(message.length < 4){
    next({status: 400, message: "Message must be longer than 4 characters."});
  }
}

function replaceTags(req, res, next){
  var username = req.body.username.trim();
  var text = req.body.message.trim();

  username = formatter.escapeHtml(username);

  text = formatter.escapeHtml(text);
  text = formatter.tagsToHtml(text);

  req.body.username = username;
  req.body.message = text;
}



function postComment(req, res, next) {

  const date = moment();
  const timestamp = date.unix();
  const dateTime = formatter.formatDateTime(date);

  req.body.post_time = timestamp;
  req.body.update_time = timestamp;
  console.log(dateTime, timestamp);
  req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  if(!!req.body.preview){
    res.status(200).json({
      data: {
        username: req.body.username,
        message: req.body.message,
        private: parseInt(req.body.private),
        post_time: dateTime,
        update_time: dateTime
      }
    });
    return;
  }
  db.none('insert into comments(username, message, private, post_time, update_time, ip) ' +
      'values(${username}, ${message}, ${private}, ${post_time}, ${update_time}, ${ip})', req.body)
    .then(function () {
      res.status(200).json({
        data: {
          username: req.body.username,
          message: req.body.message,
          private: parseInt(req.body.private),
          post_time: dateTime,
          update_time: dateTime
        }
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function editComment(req, res, next) {
  db.none('update comments set name=$1, message=$2 where id=$3',
    [req.body.username, req.body.message, parseInt(req.params.id)])
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
  getComments: getComments,
  postComment: postComment,
  commentMessageValidator: commentMessageValidator,
  editComment: editComment
};
