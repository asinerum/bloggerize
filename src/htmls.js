///////////////////////////////////////////////////////////

globalThis.HTML_STYLE = '<style>img{max-width:100%;height:auto;}a{text-decoration:none;}a:link{color:#4287f5;}a:hover{color:red;}</style>';

globalThis.HTML_FORM = `
<!DOCTYPE html>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<html lang="en">
<head>{{head}}</head>
<body>
{{body}}
</body>
</html>`

///////////////////////////////////////////////////////////

globalThis.COMMENT_FORM = `
<comdiv class="comment-block" id="ds-{{count}}">
<a name="cmt.{{count}}"/>
<div class="sys-comment-block" id="b-{{id}}">
 <div class="comment-header">
  <p>
   <span class="comment-author" id="c{{id}}">
    <a class="comment-authorurl" href="{{profile}}" title="Meet her">{{avatar}}</a>
    <b><a class="comment-authorname" href="{{link}}" timestamp="{{timestamp}}" id="is-post-{{id}}">{{author}}</a></b>
    <span class="comment-count" style="color: #FF9966;" id="cs-post-{{id}}">({{count}})</span>
    <span class="comment-authorinfo" id="as-post-{{id}}">{{info}}</span>
   </span>
  </p>
 </div>
 <div class="comment-body">
  <p>
   <span class="comment-text" id="ss-post-{{id}}">{{content}}</span>
  </p>
 </div>
 <div class="comment-footer">
  <p>
   <a class="comment-mark" href="#page_top"><img border="0" width="12" height="12" src="https://cdn.jsdelivr.net/gh/asinerum/project/team/gui/mark.gif"/></a>
   <span class="comment-timestamp" style="color: #AAAAAA" id="ds-post-{{id}}">{{dated}}</span>
  </p>
 </div>
</div>
</comdiv>`

globalThis.COMMENT_DATA = {
  count: 0,
  id: '',
  link: '',
  author: '',
  profile: '',
  content: '',
  timestamp: '',
  dated: '',
  avatar: '&#9673;',
  info: '&#10003;',
}

///////////////////////////////////////////////////////////

globalThis.POST_FORM = `
<div class="post-entry" id="AhttBlogspotComments" style="text-align: justify; width: 100%; overflow-wrap: break-word;">
 <p>
 <a class="post-title" id="bloggerEntryURL" href="{{entry}}">
  <h2 class="post-entry-title" style="color: blue;" id="bloggerEntryTitle">{{title}}</h2>
 </a>
 </p>
 <p>
 <h3 class="post-author" style="color: blue;" id="bloggerEntryAuthor">{{author}}</h3>
 <h5 class="post-info" style="color: blue;">
  <span class="post-label" id="bloggerEntryLabel">{{label}}</span>
  <span class="post-stamp" id="bloggerEntryGMTDate">{{stamp}}</span>
 </h5>
 </p>
 <p>
 <span class="post-entry-content" id="bloggerEntryContent">
  {{content}}
 </span>
 </p>
 <p>
 <a name="comments-show"></a>
 <h2 class="post-comments-info" style="color: blue;">
  <a class="post-comments-notice" id="bloggerCommentCountingNotice" href="{{compage}}"><span class="post-comments" id="bloggerEntryTotalComments">{{total}}</span>&nbsp;Comments</a>
  <span class="post-comments-count">(Page <span class="post-comments-page" id="bloggerCommentPageNo">{{pageno}}</span>/<span class="post-comments-pages" id="bloggerTotalCommentPages">{{pages}}</span>)</span>
  <span class="post-comments-link" id="bloggerEntryCommentsLink">{{comlink}}</span>
 </h2>
 </p>
 <p>
 <span class="post-comments-container" id="bloggerEntryComment">
  {{comments}}
 </span>
 </p>
</div>`

globalThis.POST_DATA = {
  entry: '',
  title: '',
  author: '',
  label: '',
  stamp: '',
  total: 0,
  pageno: 0,
  pages: 0,
  content: '',
  comments: '',
  compage: '',
  comlink: '',
}

///////////////////////////////////////////////////////////