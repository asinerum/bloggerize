import {} from './loadlib.js';

export const BLOG_URL = 'https://an-hoang-trung-tuong-2014.blogspot.com';
export const BLOG_URL_ALT = 'https://an-hoang-trung-tuong.blogspot.com';

export const ARCHIVE_URL = 'https://comment-archive.blogspot.com';
export const ARCHIVE_BLOG_ID = '8254806400148362373';

export let teamMembers;

export const COMMENTS_PER_PAGE = 200;

// This differs from loadlib.loadJson(url)
const loadjson = async function (filepath) {
  try {
    const { default: data } = await import (filepath, {
      with: { type: 'json' }
    });
    return data;
  } catch (err) {
    console.error('Error loading JSON file:', err.message);
    process.exit(0);
  }
}

const nodefetch = async function (url) { // Not native fetch
  const node_fetch = (await import('node-fetch')).default;
  const data = await node_fetch(url);
  return data;
}

export async function getPage (url) {
  return await nodefetch(url);
}

export async function getMembers (url) {
  const team = await loadJson(url);
  if (team) {
    teamMembers = team.members;
    return teamMembers;
  }
  return {};
}

// Get Blogspot blog ID information by its URL
export async function getBlogId (url=BLOG_URL, getid=true) {
  const feedUrl = `${url}/feeds/posts/summary?alt=json&max-results=1&start-index=1`;
  const res = await nodefetch(feedUrl);
  if (!res.ok) throw new Error(`Failed to fetch blog ID: ${res.statusText}`);
  const data = await res.json();
  if (getid) return data.feed.id.$t.split('-').pop();
  data.feed;
}

// Get posts between date range
export async function getPosts (fromdate, {todate=null, url=BLOG_URL}={}) {
  todate = (todate||fromdate).convertDate() + 'T23:59:59Z';
  fromdate = fromdate.convertDate() + 'T00:00:00Z';
  const feedUrl = `${url}/feeds/posts/summary?alt=json&redirect=false&max-results=200&start-index=1&published-min=${fromdate}&published-max=${todate}`;
  const res = await nodefetch(feedUrl);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);
  const data = await res.json();
  const entries = data.feed.entry || [];
  const posts = [];
  for (const entry of entries) {
    const res = await nodefetch(entry.link.findObject('rel', 'self').href + '?alt=json');
    if (!res.ok) throw new Error(`Failed to fetch post content: ${res.statusText}`);
    const data = await res.json();
    const content = data.entry.content.$t;
    posts.push({
      id: entry.id.$t.split('-').pop(),
      title: entry.title.$t,
      label: entry.category?.at(0).term || '',
      entry: entry.link.findObject('rel', 'alternate').href,
      stamp: entry.published.$t.split('.')[0].replace(/t/i, ' '),
      author: entry.author[0].name.$t,
      summary: entry.summary.$t,
      total: entry.thr$total.$t,
      pages: 0,
      pageno: 0,
      comments: [],
      compage: '',
      comlink: '',
      content,
    });
  }
  return posts;
}

// Get comments for a post: getComments(post[i], {})
export async function getComments (post={}, {frompage=1, pages=1, url=BLOG_URL, limit=COMMENTS_PER_PAGE, newest=false}={}) {
  const total = Number(post.total);
  const tpages = Math.ceil(total / limit);
  if (!total || (frompage < 1) || (limit * (frompage - 1) >= total)) return [];
  if (pages < 1 || frompage + pages - 1 > tpages) pages = tpages - frompage + 1;
  const comments = [];
  for (let page = frompage; page < frompage+pages; page++) {
    const commentindex = page * limit;
    const index = newest ? commentindex : Math.max((total - commentindex + 1), 1);
    const commentsPerLoad = (page >= tpages) ? (total - (limit * (page - 1))) : limit;
    const feedUrl = `${url}/feeds/${post.id}/comments/default?alt=json&start-index=${index}&max-results=${commentsPerLoad}`;
    const res = await nodefetch(feedUrl);
    if (!res.ok) {
      console.log('Failed to fetch comments for page #', page);
      continue;
    }
    let id, count, author, profile, timestamp;
    const data = await res.json();
    const entries = data.feed?.entry || [];
    if (!newest) entries.reverse();
    const pagecomments = entries.map((comment, i) => ({
      id: (id = comment.id.$t.split('-').pop()),
      count: (count = commentindex - limit + i + 1),
      link: `${post.entry}?commentPage=${page}#c${id}`,
      author: (author = comment.author[0].name?.$t || ''),
      profile: (profile = comment.author[0].uri?.$t || ''),
      avatar: comment.author[0].gd$image.src.convertAvatarUrl(),
      timestamp: (timestamp = comment.published.$t), // To check blacklisting
      dated: comment.gd$extendedProperty.findObject('name', 'blogger.displayTime').value,
      content: getStyledComment(profile, author, timestamp, comment.content.$t, false),
      info: showVIP(profile, 1, 24, '&nbsp;', 1, count, id, post.entry),
    }));
    comments.push({page, tpages, pagecomments});
  }
  return comments;
}

// Combine getPosts and getComments
export async function loadBlog (fromdate, frompage=1, {todate=null, pages=1, url=BLOG_URL, limit=COMMENTS_PER_PAGE, newest=false}={}) {
  try {
    const posts = await getPosts(fromdate, {todate, url});
    const results = [];
    for (const post of posts) {
      const comments = await getComments(post, {frompage, pages, url, limit, newest});
      results.push({post, comments});
    }
    return results;
  } catch (err) {
    console.error('Error:', err.message);
    return [];
  }
}

// Make text/html to save as independent html page
export async function extractBlog (fromdate, frompage=1, {todate=null, pages=1, url=BLOG_URL, limit=COMMENTS_PER_PAGE, newest=false, texthtml=true, pteindex=0}={}) {
  const entries = await loadBlog(fromdate, frompage, {todate, pages, url, limit, newest});
  if (entries.length === 0) return {}; // OBJECT
  const htmls = [];
  for (const entry of entries) {
    const commentpages = entry.comments;
    for (const commentpage of commentpages) {
      const html = cloneObject(entry.post);
      html.pageno = commentpage.page;
      html.pages = commentpage.tpages;
      html.compage = `${html.entry}?commentPage=${commentpage.page}#comments`;
      html.file = `${html.stamp.split(' ')[0]}.${html.entry.split('/').pop().replace(/\.(?=[^.]*$)/, '.CP'+commentpage.page+'.')}`;
      if (commentpage.page > 1) html.content = html.summary + `\n(<a href="${html.compage}">read more</a>)`;
      if (pteindex > 0) {
        const ptecore = UserVIPs[pteindex-1][0] || pteindex;
        html.comments = commentpage.pagecomments.filter(item => ptecore.ireg().test(item.profile));
      } else {
        html.comments = commentpage.pagecomments;
      }
      html.vol = html.comments.length;
      htmls.push(html);
    }
  }
  if (!texthtml) return htmls; // ARRAY
  const texts = [];
  for (const html of htmls) {
    html.comments = html.comments.map(item => item.content.generateComment(cloneObject(item))).join('')+'\n';
    texts.push({
      vol: html.vol,
      file: html.file,
      page: html.pageno,
      title: html.title,
      label: html.label,
      html: html.content.generatePost(cloneObject(html)).generateHtml()
    });
  }
  return texts;
}
