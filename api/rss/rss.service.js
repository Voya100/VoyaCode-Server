module.exports = {
  getBlogRss,
  refreshBlogRss
}

const rss = require('rss');
const Promise = require('bluebird');
const NodeCache = require( "node-cache" );

// TTL isn't really needed due to how cache is reset manually, 
// but if for some reason it is skipped, it's not too big of a task to update it once a day
const rssCache = new NodeCache({ stdTTL: 24*60*60 });

const blogService = require('../blogs/blogs.service');

function getBlogRss(){

  // Get from cache, if cached
  let xml = rssCache.get('blog-rss-cache');
  if(xml){
    return Promise.resolve(xml);
  }

  const feed = new rss({
    title: 'Voya\'s blog RSS',
    description: 'RSS feed for all blogs posted on Voya Code.',
    feed_url: 'https://voyacode.com/blogs/rss',
    site_url: 'https://voyacode.com',
    language: 'en',
    ttl: 60
  });
  
  return blogService.getBlogs(15, false).then((blogs) => {
    blogs.forEach((blog) => {
      const date = blog.date;
      blogService.formatBlogResponse(blog);
      feed.item({
        title: blog.name,
        description: blog.text,
        url: 'https://voyacode.com/blogs/' + blog.id,
        date: date
      });
    });

    xml = feed.xml({ indent: true });
    rssCache.set('blog-rss-cache', xml);
    
    return xml;
  });
}

// Resets cache, as an example when a new blog has been updated
function refreshBlogRss(){
  rssCache.del('blog-rss-cache');
}
