console.log('Loading libs..');

const fs = require('fs');
const path = require('path');

const hf = require('./htmls.js');
const pubvar = require('./blogger.pubvar.gd3.js');
const frmvar = require('./blogger.format.gd3.js');
const memvar = require('./buasc.js');

// Enable DOM global objects
// This may be in conflict with GoogleAPIs
const jd = require('jsdom-global')();

// Enable <DOMParser> class
const {JSDOM} = require('jsdom');
const jsdom = new JSDOM(`<!DOCTYPE html>`);
const {window} = jsdom;

/////////////////////////////////////////////////////////////////////////////

globalThis.DOMParser = window.DOMParser;

globalThis.DEF_HIDE_STAMPS = false;
globalThis.DEF_HIDE_COUNTS = false;

/////////////////////////////////////////////////////////////////////////////

globalThis.getArchivePostData = function (domdoc, timezone=7) {
  let data = {};
  data.entry = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryURL', attr: 'href'});
  data.title = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryTitle'});
  data.author = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryAuthor'});
  data.label = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryLabel'});
  data.stamp = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryGMTDate'});
  data.total = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryTotalComments'}) || 0;
  data.pages = getAttribute(domdoc, {sel: 'id', sid: 'bloggerTotalCommentPages'}) || 1;
  data.pageno = getAttribute(domdoc, {sel: 'id', sid: 'bloggerCommentPageNo'}) || 1;
  data.content = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryContent', attr: 'innerHTML'});
  data.compage = getAttribute(domdoc, {sel: 'id', sid: 'bloggerCommentCountingNotice', attr: 'href'});
  data.comlink = getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryCommentsLink', attr: 'innerHTML'});
  data.stamp = data.stamp || getAttribute(domdoc, {sel: 'id', sid: 'bloggerEntryHanoiDate'}) + `+${timezone}`;
  data.label = data.label || '&#9730;'; // Umbrella web symbol
  data.content = removeFontSize(data.content).cleanbrtags();
  data.comments = ''; // Be filled later
  return data
}

globalThis.getArchiveCommentsData = function (comdiv) {
  let data = {};
  data.count = getAttribute(comdiv, {sel: 'tag', sid: 'a', attr: 'name'}).split('.').pop();
  const id1 = getAttribute(comdiv, {sid: 'comment-header', attr: 'id'});
  const id2 = getAttribute(comdiv, {sid: 'comment-text', attr: 'id'});
  data.id = (id1 || id2)?.split('-').pop();
  data.author = getAttribute(comdiv, {sid: 'comment-authorname'});
  data.profile = getAttribute(comdiv, {sid: 'comment-authorurl', attr: 'href'});
  data.profile_id = data.profile ? data.profile.split('/').slice(-1).pop() : '';
  data.avatar_url = getAttribute(comdiv, {sid: 'comment-avatar', attr: 'src'});
  data.link = getAttribute(comdiv, {sid: 'comment-authorname', attr: 'href'});
  data.dated = getAttribute(comdiv, {sid: 'comment-authorname', attr: 'alt'}); // VERY OLD STYLE
  const stamp1 = getAttribute(comdiv, {sid: 'comment-header', attr: 'timestamp'}); // SINCE 2014
  const stamp2 = getAttribute(comdiv, {sid: 'comment-authorname', attr: 'timestamp'}); // LATEST
  data.timestamp = stamp1 || stamp2 || data.dated?.convertTime(); // PICK THIS BEFORE data.dated
  if (!data.dated) data.dated = getAttribute(comdiv, {sid: 'comment-timestamp'}); // LATEST TIME
  var reply = getAttribute(comdiv, {sid: 'reply-text', attr: 'innerHTML'});
  reply = reply ? `\n\n<blockquote>${reply.cleanrepbrtags().cleanrepbrtags()}</blockquote>\n\n` : '';
  data.content = getAttribute(comdiv, {sid: 'comment-text', attr: 'innerHTML'}).cleanbrtags() + reply;
  data.content = removeFontSize(data.content).cleanrepptags();
  data.info = ''; // Be filled later
  return data
}

globalThis.getArchivePageData = function (domdoc, comdivs) {
  let post = getArchivePostData(domdoc);
  let coms = [];
  for (const comdiv of comdivs) {
    let com = getArchiveCommentsData(comdiv);
    com.info = showVIP(com.profile, 1, 24, '&nbsp;', 1, com.count, com.id, post.entry);
    com.content = getStyledComment(com.profile, com.author, com.timestamp, com.content, false);
    // com.content = com.content.cmt2html();
    coms.push(com);
  }
  post.comments = coms;
  return post;
}

globalThis.convertComments = function (commentObject) {
  commentObject.avatar = commentObject.avatar_url.convertAvatarUrl();
  return commentObject.content.generateComment(cloneObject(commentObject));
}

String.prototype.convertArchiveData = function (sid='comment-block') {
  const domdoc = this.domdoc();
  const comdata = this.pickContent().domdoc();
  const comdivs = comdata.getElementsByClassName(sid);
  return getArchivePageData(domdoc, comdivs);
}

String.prototype.convertArchiveHtml = function (head=HTML_STYLE) {
  let data = this.convertArchiveData();
  if (!data.comlink) data.comlink = '';
  data.comments = data.comments.map(item => convertComments(item)).join('')+'\n';
  return data.content.generatePost(cloneObject(data)).generateHtml(head);
}

/////////////////////////////////////////////////////////////////////////////

// Ref. String.prototype.domdoc();
String.prototype.domdoc2 = function () {
  return this.window().document;
}

// Reserved for old versions
String.prototype.comdiv = function (profunc='cmt2html') {
  return this.correctContent(profunc);
}

String.prototype.void = function () { return this; }
String.prototype.jsdom = function () { return new JSDOM(this); }
String.prototype.window = function () { return this.jsdom().window; }
String.prototype.getdeid = function (deid) { return this.window().document.getElementById(deid).innerHTML; }
String.prototype.getisel = function (tag, index=0) { return this.window().document.querySelector(tag)[index].innerHTML; }

/////////////////////////////////////////////////////////////////////////////

String.prototype.createFolder = function () {
  // [this] can be a slash-separated string aka nested folder
  const folderPath = path.join(process.cwd(), this.toString());
  try {
    fs.mkdirSync(folderPath, {recursive: true});
    return true;
  } catch (err) {
    return false;
  }
}

String.prototype.generateHtml = function (head=HTML_STYLE, form=HTML_FORM) {
  return form.parse({head, body: this});
}

String.prototype.generateComment = function (objComment={}, form=COMMENT_FORM) {
  objComment.content = this.toString();
  return form.parse(objComment);
}

String.prototype.generatePost = function (objPost={}, form=POST_FORM) {
  objPost.content = this.toString();
  return form.parse(objPost);
}

// Global usage:
// require('./loadlib.js');

/////////////////////////////////////////////////////////////////////////////