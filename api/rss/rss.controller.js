module.exports = {
  getBlogRss
}

const rssService = require('./rss.service')

function getBlogRss(req, res, next){
  rssService.getBlogRss().then((xml) => {
    res.set('Content-Type', 'text/xml');
    res.send(xml);
  })
  .catch(next);
}