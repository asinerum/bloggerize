let args = process.argv[2];

if (!args) {
  console.log(`Syntax: node delete.js "from:<DD/MM/YYYY>, to:<DD/MM/YYYY>, blog:[BLOG_ID]"`);
  process.exit(0);
}

require('bloggerize/blogger.format.gd3');

args = args.extractInput();

let fromdate = args.from || '';
let todate = args.to || fromdate;

if (!fromdate || !todate) {
  console.log(`Invalid date range provided`);
  process.exit(0);
}

const upload = require('bloggerize/upload');
const BLOG_ID = '8254806400148362373';

let blog_id = args.blog || BLOG_ID;
let maxResults = args.max || 500;

todate = (todate || fromdate).convertDate() + 'T23:59:59Z';
fromdate = fromdate.convertDate() + 'T00:00:00Z';

upload.deletePosts(fromdate, todate, {blog_id, maxResults});
