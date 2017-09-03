module.exports = {
  escapeHtml,
  formatDate,
  formatDateTime,
  tagsToHtml
}

const moment = require('moment-timezone');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(date){
  return moment(date).tz('Europe/Helsinki').format('DD.MM.YYYY');
}

function formatDateTime(date){
  return moment(date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm');
}

function tagsToHtml(text){
  text = text.replace(/\n/g, "<br>");
  text = replaceTag('b', text);
  text = replaceTag('i', text);
  text = replaceTag('u', text);

  var tag = /\[url=(.*?)\](.*?)\[\/url\]/i;
  var tagRep = '<a href="$1" target="_blank">$2</a>';
  text = text.replace(tag, tagRep);

  tag = /\[color=(.*?)\](.*?)\[\/color\]/i;
  tagRep= '<span style="color:$1">$2</span>';
  text = text.replace(tag, tagRep, text);

  return text;
}

function replaceTag(tagName, text){
  var regex = RegExp('\\[' + tagName + '\\](.*?)\\[\/' + tagName + '\\]', 'g');
  var tagRep = '<' + tagName + '>$1</' + tagName + '>';
  return text.replace(regex, tagRep);
}

