import {} from './blogger.format.gd3.js';

import { default as fs } from 'fs';

import * as cheerio from 'cheerio';

// Google API >< JSDOM conflicts
import { google } from 'googleapis';

const TOKEN_PATH = './token.json';
const APIKEY_PATH = './apikey.json';
const CREDENTIALS_PATH = './credentials.json';
const SCOPES = ['https://www.googleapis.com/auth/blogger'];

export const BLOG_ID = '8254806400148362373';
export const BLOG_URL = 'https://comment-archive.blogspot.com';

export async function rlInterface () {
  const readline = await import('readline');
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
}

export function getToken (oAuth2Client, code, {cbf=console.log, token_path=TOKEN_PATH}={}) {
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token:', err.message);
    oAuth2Client.setCredentials(token);
    fs.writeFileSync(token_path, JSON.stringify(token));
    console.log('Token stored to:', token_path);
    cbf(oAuth2Client);
  });
}

// Get new token if none exists
// Just publish Google Cloud project of the credentials to prevent token expiration
export async function getNewToken (oAuth2Client, cbf=console.log, {token_path=TOKEN_PATH, scopes=SCOPES}={}) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
  console.log('Authorize this app by visiting this URL:\n\n', authUrl, '\n\n');
  const rl = await rlInterface();
  rl.question('Enter the code from that page here:\n', function (code) {
    getToken(oAuth2Client, code.trim(), {cbf, token_path});
    rl.close();
  });
}

// Google Blogger API must be enabled in Google Cloud project
// oAuth2 credentials got at https://console.cloud.google.com/apis/dashboard?project=XXX
export function authorize (token_path=TOKEN_PATH, credentials_path=CREDENTIALS_PATH) {
  let oAuth2Client;
  try {
    const credentials = JSON.parse(fs.readFileSync(credentials_path));
    const { client_id, client_secret, redirect_uris } = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  } catch (err) {
    console.error('Error loading credentials:', err.message);
    return [null, null];
  }
  try {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(token_path)));
    return [oAuth2Client, true];
  } catch (err) {
    console.error('Error loading client token:', err.message);
    return [oAuth2Client, false];
  }
}

export async function authorizeThru (cbf=console.log, {token_path=TOKEN_PATH, credentials_path=CREDENTIALS_PATH}={}) {
  const [oAuth2Client, tokenpass] = authorize(token_path, credentials_path);
  if (!oAuth2Client) return cbf(null);
  if (!tokenpass) return await getNewToken(oAuth2Client, cbf, {token_path});
  cbf(oAuth2Client);
}

// Delete Blogger posts in a date range
// start_date/end_date format: YYYY-MM-DD
export async function deletePosts (start_date, end_date, {blog_id=BLOG_ID, maxResults=500}={}) {
  const [auth, tokenpass] = authorize();
  if (!auth || !tokenpass) {
    return console.log('Failed to get client credentials');
  }
  const blogger = google.blogger({ version: 'v3', auth });
  try {
    const blogRes = await blogger.blogs.get({ blogId: blog_id });
    const blogId = blogRes.data.id;
    console.log('Blog ID resolved:', blogId);
    const postsRes = await blogger.posts.list({
      blogId,
      maxResults,
      startDate: start_date,
      endDate: end_date,
      orderBy: 'published',
      fetchBodies: false
    });
    const posts = postsRes.data.items || [];
    console.log(`Found ${posts.length} posts`);
    const postsToDelete = posts; // May use filter()
    console.log(`Deleting ${postsToDelete.length} posts..`);
    for (const post of postsToDelete) {
      await blogger.posts.delete({ blogId, postId: post.id });
      console.log(`Deleted post: ${post.title} (${post.id})`);
    }
    console.log('Done');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Post HTML file content to Blogger
export async function insertPosts (files, draft=false, blog_id=BLOG_ID, blog_url=BLOG_URL) {
  const [auth, tokenpass] = authorize();
  if (!auth || !tokenpass) {
    return console.log('Failed to get client credentials');
  }
  const blogger = google.blogger({ version: 'v3', auth });
  for (const file of files) {
    let text, head;
    try {
      const content = fs.readFileSync(file, 'utf8');
      [head, text] = await domGetArchivePostData(content);
    } catch (err) {
      console.error('File Error:', err.message);
      continue;
    }
    const postData = text.bloggerPostData(
      blog_id,
      head.title,
      { tid: ':P', page: head.pageno, labels: [head.label], dated: head.stamp.slice(0, 10) }
    );
    // (await postNotExist2(postData.published, postData.title, blog_url))
    if (await postNotExist(postData.published, postData.title, blog_id)) {
      blogger.posts.insert({
        blogId: blog_id,
        requestBody: postData,
        isDraft: draft,
      }, (err, res) => {
        if (err) {
          console.error('File:', file);
          console.error('Post:', postData.title);
          console.error('API Error:', err.message);
          return;
        }
        console.log('Published:', res.data.url);
      });
    } else {
      console.log('Ignored existing post:', postData.title);
    }
  }
}

export async function domGetArchivePostData (html, timezone=7, labicon='&#9730;') {
  const text = html.pickContent('<body>', '</body>', false);
  // const cheerio = await import('cheerio');
  const $ = cheerio.load(text);
  const head = {};
  head.title = $('#bloggerEntryTitle').first().text().trim();
  head.label = $('#bloggerEntryLabel').first().text().trim();
  head.stamp = $('#bloggerEntryGMTDate').first().text().trim();
  head.stampHn = $('#bloggerEntryHanoiDate').first().text().trim();
  head.pageno = $('#bloggerCommentPageNo').first().text().trim();
  head.stamp = head.stamp || head.stampHn + `+${timezone}`;
  head.label = head.label || labicon;
  return [head, text];
}

// Get posts between date range using GoogleAPIs with API Key
// This is not the same function as the one at <download.getPosts>
export async function getPosts (fromdate, {todate=null, url=BLOG_URL, blog=BLOG_ID, apikey_path=APIKEY_PATH}={}) {
  todate = (todate||fromdate).convertDate() + 'T23:59:59Z';
  fromdate = fromdate.convertDate() + 'T00:00:00Z';
  const apikey = JSON.parse(fs.readFileSync(apikey_path)).key;
  const feedUrl = `https://www.googleapis.com/blogger/v3/blogs/${blog}/posts?maxResults=500&startDate=${fromdate}&endDate=${todate}&key=${apikey}`;
  const data = await loadJson(feedUrl);
  const entries = data.items || [];
  const posts = [];
  for (const entry of entries) {
    posts.push({
      id: entry.id,
      title: entry.title,
      label: entry.labels?.at(0) || '',
      entry: entry.url,
      stamp: entry.published,
      author: entry.author?.displayName,
      summary: '', // Can be filled later
      total: entry.replies?.totalItems,
      pages: 0,
      pageno: 0,
      comments: [],
      compage: '',
      comlink: '',
      content: entry.content,
    });
  }
  return posts;
}

// Check posts title using GoogleAPIs with API Key
export async function postNotExist (dated, title, blog=BLOG_ID, apikey_path=APIKEY_PATH) {
  dated = dated.slice(0, 10);
  const fromdate = dated + 'T00:00:00Z';
  const todate = dated + 'T23:59:59Z';
  const apikey = JSON.parse(fs.readFileSync(apikey_path)).key;
  const feedUrl = `https://www.googleapis.com/blogger/v3/blogs/${blog}/posts?maxResults=50&startDate=${fromdate}&endDate=${todate}&key=${apikey}`;
  const data = await loadJson(feedUrl);
  const entries = data.items || [];
  for (const entry of entries) if (entry.title == title) return false;
  return true;
}

// Check posts title using Blogger Atom with no API Key
export async function postNotExist2 (dated, title, url=BLOG_URL) {
  dated = dated.slice(0, 10);
  const fromdate = dated + 'T00:00:00Z';
  const todate = dated + 'T23:59:59Z';
  const feedUrl = `${url}/feeds/posts/summary?alt=json&redirect=false&max-results=200&published-min=${fromdate}&published-max=${todate}`;
  const data = await loadJson(feedUrl);
  const entries = data?.feed?.entry;
  if (Array.isArray(entries)) for (const entry of entries) if (entry.title?.$t == title) return false;
  return true;
}
