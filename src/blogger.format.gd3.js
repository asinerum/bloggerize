//////////////////////////////////////////////////
//
// Vars loaded from {blogger.pubvar.gd.js}
//
//////////////////////////////////////////////////
//
// Cookie-functions:
//
function setcookie(c_name,value,exdays){
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie = c_name + "=" + c_value;
}
function getcookie(c_name){
  var i, x, y, ARRcookies = document.cookie.split(";");
  for(i=0; i<ARRcookies.length; i++){
    x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
    x = x.replace(/^\s+|\s+$/g,"");
    if(x==c_name){
      return(unescape(y));
    }
  }
}
//
//////////////////////////////////////////////////
//
// Format-functions:
//
// Global 25
//
String.prototype.ireg = function (scope='i') {
  return new RegExp(this, scope);
}
Array.prototype.findObject = function (key, value) {
  return this.find(obj => obj[key] === value);
}
globalThis.isObject = function (x) {
  return (typeof x === 'object' && !Array.isArray(x) && x !== null);
}
globalThis.cloneObject = function (obj) {
  return JSON.parse(JSON.stringify(obj));
}
function removeFontSizeStyle (htmlString) {
  const regex = /font-size\s*:\s*[^;"]+;?/gi;
  return htmlString.replace(regex, '').replace(/style\s*=\s*""/gi, '');
}
function removeFontSizeAttribute (htmlString) {
  const regex = /\s*size\s*=\s*(["'])(?:(?!\1).)*\1|\s*size\s*=\s*\w+/gi;
  return htmlString.replace(regex, '');
}
globalThis.removeFontSize = function (htmlString) {
  return removeFontSizeStyle(removeFontSizeAttribute(htmlString));
}
String.prototype.domdoc = function () {
  const parser = new DOMParser();
  return parser.parseFromString(this, 'text/html');
}
globalThis.replaceSpanContentByClass = function (htmlString, className, newContent) {
  const doc = htmlString.domdoc();
  const spans = doc.querySelectorAll(`span.${className}`);
  for (const span of spans) {
    span.textContent = newContent;
  }
  return doc.documentElement.innerHTML;
}
globalThis.replaceSecondLastAppearance = function (originalString, search, replacement) {
  const lastIndex = originalString.lastIndexOf(search);
  if (lastIndex === -1) return originalString;
  const secondLastIndex = originalString.lastIndexOf(search, lastIndex - 1);
  if (secondLastIndex === -1) return originalString;
  const partBefore = originalString.slice(0, secondLastIndex);
  const partAfter = originalString.slice(secondLastIndex + search.length);
  return partBefore + replacement + partAfter;
}
globalThis.replaceLastAppearance = function (originalString, search, replacement) {
  const lastIndex = originalString.lastIndexOf(search);
  if (lastIndex === -1) return originalString;
  const partBefore = originalString.slice(0, lastIndex);
  const partAfter = originalString.slice(lastIndex + search.length);
  return partBefore + replacement + partAfter;
}
globalThis.updateCodeLine = function (codeline, toreplace='const', replacewith='var') {
  if (RegExp(`^${toreplace}\\s+`).test(codeline)) {
    codeline = codeline.replace(toreplace, replacewith);
  }
  return codeline;
}
globalThis.getProperties = function (domdoc, idname, property, selector='id') {
  if (selector === 'class') { selector = `.${idname}`; }
  else if (selector === 'id') { selector = `#${idname}`; }
  else { selector = idname; }
  try {
    return [...domdoc.querySelectorAll(selector)].map(item => item[property]);
  } catch (err) {
    console.log(err.message);
    return [];
  }
}
globalThis.getAttribute = function (domdoc, {sid, sel='class', attr='textContent'}) {
  try {
    const func = (() => {
      if (sel == 'name') { return 'getElementsByName'; }
      else if (sel == 'class') { return 'getElementsByClassName'; }
      else if (sel == 'tag') { return 'getElementsByTagName'; }
      else { return null; }
    })();
    const dom = func ? domdoc[func](sid)[0] : domdoc.getElementById(sid);
    if (dom) {
      if (dom[attr] !== undefined) return dom[attr];
      return dom.getAttribute(attr);
    }
    return null;
  } catch (err) {
    return console.log(err.message);
  }
}
String.prototype.parse = function (values={}) {
  return this.replace(/{{(.*?)}}/g, (match) => {
    return values[match.split(/{{|}}/).filter(Boolean)[0].trim()];
  });
}
String.prototype.html = function (checkonly=true) {
  return this.createDiv(checkonly);
}
// Keeps slash in self-closing tag
String.prototype.htmlValue = function () {
  const temp = document.createElement('textarea');
  temp.innerHTML = this.toString();
  return temp.value;
}
// Escape slash in self-closing tag
String.prototype.htmlEncode = function () {
  return this.html(false).innerHTML;
}
String.prototype.htmlDecode = function () {
  return this.replace(/[^\u0000-\u007F]/g, function(match) {
    const codePoint = match.codePointAt(0);
    return `&#${codePoint};`;
  });
}
String.prototype.perfect = function () {
  const origin = this.toString();
  const text = origin.htmlEncode().htmlDecode();
  return [origin, origin.replace(/\/>/g, '>')].includes(text);
}
String.prototype.createDiv = function (checkonly=false) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = this;
  if (checkonly) return tempDiv.outerHTML;
  return tempDiv; // Just DIV element object
}
String.prototype.generateDiv = function (attributes={}, tag='div') {
  const formatAttributes = (attrs) => {
    return Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
  };
  attributes = formatAttributes(attributes);
  return `<${tag}${attributes ? ' ': ''}${attributes}>${this}</${tag}>`;
}
String.prototype.convertDate = function () {
  try {
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(this)) {
      const parts = this.split('/');
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    } else {
      return new Date(this).toISOString().split('T')[0];
    }
  } catch {
    return new Date(this).toString();
  }
}
String.prototype.convertTime = function () {
  try {
    const year = this.split('-')[0].split('/')[0];
    if (year.length === 4) return new Date(this.toString()).toISOString();
    const date = this.split('T')[0].split(' ')[0];
    return new Date(this.replace(date, date.convertDate())).toISOString();
  } catch {
    return new Date(this).toString();
  }
}
String.prototype.forceHttps = function (force='https://') {
  if (this.startsWith('//')) {
    return 'https:' + this;
  } else if (/^http:\/\//i.test(this)) {
    return force + this.substring(7);
  }
  return this.toString();
}
String.prototype.convertAvatarUrl = function (force='https://') {
  return `<img src="${this.forceHttps(force)}" class="comment-avatar" width="24" height="24" border="0"/>`;
}
String.prototype.replaceIframeDimensions = function (newWidth='100%', newHeight='auto') {
  const [doc, allElements] = domParser(this.toString(), 'iframe');
  allElements.forEach(iframe => {
    iframe.setAttribute('width', newWidth);
    iframe.setAttribute('height', newHeight);
    let src;
    if (src=iframe.getAttribute('src')) iframe.setAttribute('src', src.forceHttps());
  });
  return doc.body.innerHTML;
}
String.prototype.extractInput = function () {
  const args = this.replace(/\s/g, '').toLowerCase().split(',').map(item => {
    let elem = {};
    const key = item.split(':')[0];
    const val = item.substr(key.length + 1);
    elem[key] = val;
    return elem;
  });
  return Object.assign({}, ...args);
}
globalThis.nowDate = function () {
  return (new Date()).toISOString().split('T')[0];
}
String.prototype.bloggerPostData = function (blog, title, {dated=nowDate(), tid='', page=0, labels=[]}={}) {
  return {
    kind: 'blogger#post',
    blog: { id: blog },
    title: title + (tid ? ` ${tid}${page}` : ''),
    content: this.toString(),
    labels: labels,
    published: `${dated}T00:${String(page).padStart(2,'0')}:00Z`
  };
}
String.prototype.correctContent = function (profunc, first='<comdiv', last='</comdiv>') {
  const start = this.indexOf(first);
  const end = this.lastIndexOf(last) + last.length;
  const taken = String.prototype[profunc].call(this.substring(start, end));
  return this.substr(0, start) + taken + this.substr(end);
}
String.prototype.pickContent = function (first='<comdiv', last='</comdiv>', outer=true) {
  const start = this.indexOf(first);
  const end = this.lastIndexOf(last);
  if (outer) return this.substring(start, end + last.length);
  return this.substring(start + first.length, end);
}
globalThis.loadJson = async function (url, format='json') {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return console.error(`Error: ${response.status}`);
    }
    const jsonData = await response[format]();
    return jsonData; 
  } catch (err) {
    console.error('Error:', err.message);
    return null;
  }
}
globalThis.blogId = async function (url) {
  const feedUrl = `${url}/feeds/posts/summary?alt=json&max-results=1&start-index=1`;
  const data = await loadJson(feedUrl);
  return data?.feed?.id?.$t?.split('-').pop();
}
globalThis.loadVars = async function (url) {
  const vars = await loadJson(url, 'text');
  if (vars) {
    eval(vars);
    return true;
  }
  return false;
}
globalThis.removeImgWidth = function (tag='img', attr='width') {
  const images = document.querySelectorAll(tag);
  images.forEach(img => { img.removeAttribute(attr); });
}
globalThis.escapeBigDimension = function (maxval=36, tag='img') {
  document.querySelectorAll(tag).forEach(img => {
    if (img.getAttribute('width') > maxval || img.getAttribute('height') > maxval) {
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
  });
};
//
// Classic
//
function sortObject(Objs, rev, back){
  var sortable = [];
  for(var key in Objs){sortable.push([key,Objs[key]]);}
  sortable.sort(function(a,b){return(a[1]-b[1]);});
  if(rev){sortable.reverse();}
  if(back){
    var cbObjs = {};
    for(var key in sortable){cbObjs[sortable[key][0]]=sortable[key][1];}
    return(cbObjs);
  }
  return(sortable);
}
String.prototype.include = function(pat){//25
  return(this.toLowerCase().split(',').includes(pat.toLowerCase()));
}
String.prototype.in = function(pat){//25
  return(pat.toLowerCase().split(',').includes(this.toLowerCase()));
}
String.prototype.extract = function(separator=','){//25
  return this.split(separator).map(e=>e.trim().toLowerCase())
}
Date.prototype.addDays = function(days){
  return(this.setDate(this.getDate()+days));
}
Date.prototype.toJDStr = function(){
  return(this.toJSON().split('T')[0]);
}
function domParser(htmlString, selectors='*', mime='text/html'){//25
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, mime);
  const allElements = doc.querySelectorAll(selectors);
  return [doc, allElements];
}
function removeStyle(htmlString, properties=['width'], selectors='span'){//25
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const spans = tempDiv.getElementsByTagName(selectors);
  for(const span of spans){
    for(const property of properties){
      if(span.style[property]){
        span.style.removeProperty(property);
      }
    }
  }
  return tempDiv.innerHTML;
}
function removeAttributes(htmlString, attributesToRemove=[]){//25
  const [doc, allElements] = domParser(htmlString);
  allElements.forEach(element=>{
    attributesToRemove.forEach(attrName=>{
      if(element.hasAttribute(attrName)){
        element.removeAttribute(attrName);
      }
    });
  });
  return doc.body.innerHTML;
}
function stripAttributes(htmlString, allowedAttributes=[], selectors='*'){//25
  const [doc, allElements] = domParser(htmlString, selectors);
  allElements.forEach(element=>{
    const attributesToRemove = [];
    for(const attr of element.attributes){
      if(!allowedAttributes.map(e=>e.toLowerCase()).includes(attr.name)){
        attributesToRemove.push(attr.name);
      }
    }
    attributesToRemove.forEach(attrName=>{
      element.removeAttribute(attrName);
    });
  });
  return doc.body.innerHTML;
}
function stripTags(htmlString, allowedTags=[], osign='<', csign='>'){//25
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString;
  const allElements = tempDiv.getElementsByTagName('*');
  for(let i=allElements.length-1; i>=0; i--){
    const element = allElements[i];
    if(!allowedTags.includes(osign+element.tagName.toLowerCase()+csign)){
      element.parentNode.removeChild(element);
    }
  }
  return tempDiv.innerHTML;
}
String.prototype.stripTags = function(allowed=[]){return stripTags(this, allowed)}//25
String.prototype.cleanTags = function(allowed=sDefAllowedTagList+sMoreAllowedTagList, forbidden=tagForbiddenAttributes, accepted=tagAllowedAttributes, limited=tagStyleLimitedProperties){//25
  text = stripTags(this, allowed.match(/<(.*?)>/g));
  text = removeAttributes(text, forbidden.extract());
  Object.entries(accepted).forEach(([key,val]) => {text = stripAttributes(text, val.extract(), key)});
  Object.entries(limited).forEach(([key,val]) => {text = removeStyle(text, val.extract(), key)});
  return text;
}
String.prototype.replaceText = function(replaceWhat, replaceTo, exp='gi'){//25
  replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  var reg = new RegExp(replaceWhat, exp);
  return(this.replace(reg, replaceTo));
}
String.prototype.clearText = function(clearWhat, exp='gi'){//25
  return(this.replaceText(clearWhat, '', exp));
}
String.prototype.adjustCmtStid = function(stid){//25
  return this.replace(new RegExp(`\\[${stid}\\]([\\w\\W]+)\\[\/${stid}\\]`, 'gi'), `[${stid}=$1]`);
}
String.prototype.replaceCmtStid = function(stid, func){//25
  return this.replace(new RegExp(`\\[${stid}=([^\\]]+)\\]`, 'gi'), String.prototype[func].call('$1'));
}
String.prototype.youtube = function(vid_stid='youtube'){//25
  vid_stid = vid_stid.toLowerCase();
  let vidfunc;
  if(vid_stid.in('img,image')){
    vidfunc = 'embedImg';
  }else if(vid_stid=='facebook'){
    vidfunc = 'embedFacebook';
  }else if(vid_stid=='liveleak'){
    vidfunc = 'embedLiveleak';
  }else if(vid_stid=='tiktok'){
    vidfunc = 'embedTiktok';
  }else{
    vid_stid = 'youtube';
    vidfunc = 'embedYoutube';
  }
  let res = this;
  res = res.adjustCmtStid(vid_stid);
  res = res.replaceCmtStid(vid_stid, vidfunc);
  return(res);
}
String.prototype.embedImg = function(){//25
  return(`<img ${DEF_STYLE} src="${this}"></img>`);
}
String.prototype.embedFacebook = function(){//25
  return(`<iframe ${DEF_STYLE} src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FPlayStation%2Fvideos%2F${this}%2F&show_text=0" frameborder="0" allowfullscreen></iframe>`);
}
String.prototype.embedLiveleak = function(){//25
  return(`<iframe ${DEF_STYLE} src="https://www.itemfix.com/e/${this}" frameborder="0" allowfullscreen></iframe>`);
}
String.prototype.embedYoutube = function(){//25
  return(`<iframe ${DEF_STYLE} src="https://www.youtube.com/embed/${this}" allow="accelerometer;encrypted-media;gyroscope;picture-in-picture;web-share" frameborder="0" allowfullscreen></iframe>`);
}
String.prototype.embedTiktok = function(){//25
  return(`<iframe ${DEF_STYLE} src="https://www.tiktok.com/embed/v2/${this}?lang=en-US" frameborder="0" allowfullscreen></iframe>`);
}
String.prototype.json2date = function(){
  var jts = this.split('T');
  var jymd = jts[0].split('-');
  var jhms = jts[1].split('+');
  var monthes = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return(monthes[jymd[1]-1]+' '+jymd[2]+' '+jhms[0].split('.')[0]+' UTC+'+jhms[1].replace(':','')+' '+jymd[0]);
}
function showListedDate(lDateTime){//25
  var lDate = lDateTime.split('T')[0];
  var lTime = lDateTime.split('T')[1].split('.')[0];
  var lZone = 'GMT+' + lDateTime.split('+')[1];
  return(`${lDate}&nbsp;${lTime}&nbsp;${lZone}`);
}
function showListedPostHref(lHref){
  var title = lHref.split('.html')[0];
  title = correctTitle(title,1); //VN
  return(title);
}
function correctTitle(title,langID){
  if(!langID){langID=1;}//[1:Viet;2:Eng]
  for(var i=0; i<exPageNames.length; i++){
    if(title==exPageNames[i][0] || title.match(RegExp('p/'+exPageNames[i][0],'i'))){
      return(exPageNames[i][langID]);
    }
  }
  title = title.split('/')[5];
  if(title){return(title.toUpperCase());}
  else return('Unknown page');
}
function revertCommentCodeToHtml(text){//25:cmt2html
  text = text.youtube();
  text = text.youtube('facebook');
  text = text.youtube('liveleak');
  text = text.youtube('tiktok');
  text = text.youtube('image');
  text = text.youtube('img');
  text = insertSmiley(text);
  return revertTags(text).cleanTags().nicep().nicea().nicetag();
}
function convertCommentHtmlToCode(text){//25
  return escapeTags(text.cleanTags().nicep().nicea().nicetag().escapebreaks()).trim();
}
String.prototype.cmt2html = function(){return(revertCommentCodeToHtml(this))}//25
String.prototype.html2cmt = function(){return(convertCommentHtmlToCode(this))}//25
function clearCustomTags(text){//25
  return(text.clearcode()); //JQuery
}
function insertSmiley(htm){
  for(var smiley in iCommentSmileys){
    htm = htm.replaceText(smiley, iCommentSmileys[smiley]);
  }
  return(htm);
}
function updateDivContent(div_id, content){
  var div = document.getElementById(div_id);
  if(!content){div.innerHTML=revertCommentCodeToHtml(div.innerHTML);}
  else{div.innerHTML=content;}
}
//
//////////////////////////////////////////////////
//
// Comment-format-customizing:
//
globalThis.getStyledComment = function(authorurl, author, published, content, fontface=true){//25
  return((openAuthorStyle(authorurl, author, published, true, fontface) + closeAuthorStyle(revertCommentCodeToHtml(content.replace(/&quot;/gi,'"').replace(/&#39;/gi,"'")), true)).replaceIframeDimensions());
}
function getStyledTitle(ct, author, authorurl, authoravatar, hrefLink, published){
  return('<a title="' + author + '&nbsp;profile" href="' + authorurl + '"><img src="' + authoravatar + '" width="24" height="24" border="0"/></a>&nbsp;<b><a href="' + hrefLink + '" title="Posted&nbsp;at&nbsp;' + showListedDate(published) + '">' + author + '</a></b>&nbsp;<span style="font-size: x-small; color: #9FC5E8;"><i>(' + ct + ')</i></span>');
}
function getCounterPat(count){
  return('[CounterPat' + count + ']');
}
function openAuthorStyle(url, name, ctime, returnvalue, fontface=true){//25
  // [ctime]: ISODateString
  isVipAuthor = false;
  isBLAuthor = false;
  isStyleItalic = false;
  isStyleBold = false;
  isStyleBGC = false;
  if(isBL(url,name,ctime)){
    isBLAuthor = true;
    if(returnvalue){return('');}
    else{return;}
  }
  var strSetStyle = '';
  var strTextStyle = '';
  for(var i=0; i<UserVIPs.length; i++){
    if(url.match(RegExp(UserVIPs[i][0], 'gi'))){
      isVipAuthor = true;
      var fSize = UserVIPs[i][2];
      var color = UserVIPs[i][3];
      var fFace = UserVIPs[i][4];
      var sItal = UserVIPs[i][5];
      var sBold = UserVIPs[i][6];
      var sBCol = UserVIPs[i][7];
      var avaID = UserVIPs[i][8]; //ShitAvatar
      strSetStyle = `<font color="${color}" face="${fontface?fFace:''}">`;
      if(returnvalue){strTextStyle+=strSetStyle;}
      else{document.write(strSetStyle);}
      if(sItal){
        isStyleItalic = true;
        strSetStyle = '<i>';
        if(returnvalue){strTextStyle+=strSetStyle;}
        else{document.write(strSetStyle);}
      }
      if(sBold){
        isStyleBold = true;
        strSetStyle = '<b>';
        if(returnvalue){strTextStyle+=strSetStyle;}
        else{document.write(strSetStyle);}
      }
      if(sBCol){
        isStyleBGC = true;
        strSetStyle = '<span style="background-color:'+sBCol+';">';
        if(returnvalue){strTextStyle+=strSetStyle;}
        else{document.write(strSetStyle);}
      }
      break;
    }
  }
  if(returnvalue){return(strTextStyle);}
}
function closeAuthorStyle(cbodyId, returnvalue){
  var strSetStyle = '';
  var strTextStyle = '';
  if(isBLAuthor){
    var strBL = 'Anh l&#224; &#244;ng b&#242; &#273;ang b&#7883; kh&#243;a m&#245;m &#273;cmnc';
    strSetStyle = rsBLAuthor ? rsBLAuthor : strBL;
    if(returnvalue){return(strSetStyle);}
    else{
      updateDivContent(cbodyId, strSetStyle);
      return;
    }
  }
  if(returnvalue){strTextStyle=cbodyId;}
  else{updateDivContent(cbodyId);}
  if(isStyleBGC){
    strSetStyle = '</span>';
    if(returnvalue){strTextStyle+=strSetStyle;}else{document.write(strSetStyle);}
  }
  if(isStyleBold){
    strSetStyle = '</b>';
    if(returnvalue){strTextStyle+=strSetStyle;}else{document.write(strSetStyle);}
  }
  if(isStyleItalic){
    strSetStyle = '</i>';
    if(returnvalue){strTextStyle+=strSetStyle;}else{document.write(strSetStyle);}
  }
  if(isVipAuthor){
    strSetStyle = '</font>';
    if(returnvalue){strTextStyle+=strSetStyle;}else{document.write(strSetStyle);}
  }
  if(returnvalue){return(strTextStyle);}
}
globalThis.isVIP = function(uid){
  for(var i=0; i<UserVIPs.length; i++){
    if(uid.match(RegExp(UserVIPs[i][0],'i'))){return(i);}
  }
  return(-1);
}
globalThis.isBL = function(url, name, ctime){
  for(var i=0; i<UserBLs.length; i++){
    if(url.match(RegExp(UserBLs[i][0], 'gi')) || name.match(RegExp(UserBLs[i][1], 'gi'))){
      rsBLAuthor = UserBLs[i][4] ? UserBLs[i][4] : false;
      if(UserBLs[i][2]){//UnlockDate
        var prs = UserBLs[i][2].split("/");
        var unlockDate = new Date(prs[0], prs[1]-1, prs[2]);
        if(UserBLs[i][3]){//LockFromDate
          prs = UserBLs[i][3].split("/");
          var lockDate = new Date(prs[0], prs[1]-1, prs[2]);
        }else{
          var lockDate = new Date(0, 0, 0);
        }
        var cmttime = new Date(ctime);
        if(isNaN(cmttime)){return(true);}
        if(cmttime>lockDate && cmttime<unlockDate){return(true);}
      }else{return(true);}
    }
  }
  return(false);
}
globalThis.showVIP = function(uri, tag, width, nbsp, ava, ancNum, ancData, postUrl=strPostURL){
  let ancRec = ancNum ? 'cmt.'+ancNum : '';
  if(ancData){ancData='c'+ancData.split('-').slice(-1);}else{ancData='';}
  var cmtUrl = postUrl+"?commentPage="+Math.ceil(ancNum/numCommentPerPage)+"&showComment="+ancData+"#"+ancData;
  var icon = '';
  var vipID = isVIP(uri);
  if(vipID>=0){
    if(vipID>0){//Admin:NotVIP
      var iconURL = (vipID<=numIndexVip1) ? (urlVip1Avatar) : ((vipID<=numIndexVip2) ? (urlVip2Avatar) : (urlVip3Avatar));
      if(!tag){icon = iconURL;}
      else{icon = nbsp + '<img src="' + iconURL + '" border="0" width="' + (width*0.75) + '"/>';}
    }
    if(ava){
      var cids = UserVIPs[vipID][8].split(','); //[th][vs][..]
      var cid = cids[0];
      if(cid){
        if(!tag){
          icon += ';' + urlIdAvatars[cid][0];
        }else{
          icon += nbsp + '<a title="'+urlIdAvatars[cid][1]+'" href="'+cmtUrl+'"><img src="' + urlIdAvatars[cid][0] + '" border="0" width="' + (width*1) + '"/></a>';
          for(var i=1; i<cids.length; i++){
            cid = cids[i];
            icon += nbsp + '<img title="'+urlIdAvatars[cid][1]+'" src="' + urlIdAvatars[cid][0] + '" border="0" width="' + (width*1) + '"/>';
          }
        }
      }
      if(tag){
        /// icon += nbsp + "<div class='fb-like' data-href='"+uri+"' data-send='false' data-layout='button_count' data-width='450' data-show-faces='false'></div>";
        /// icon += nbsp + '<g:plusone zise="medium" href="'+uri+'"></g:plusone>';
      }
    }
  }
  if(ancRec||ancData){
    /// icon += nbsp + "<div class='fb-like' data-href='"+cmtUrl+"' data-send='false' data-layout='button_count' data-width='450' data-show-faces='false'></div>";
    /// icon += nbsp + '<g:plusone zise="small" href="'+cmtUrl+'"></g:plusone>';
  }
  return(icon);
}
//
//////////////////////////////////////////////////
//
// Comments-paginating:
//
function recountTotalComments(){
  numEntryCommentRecount = (numCommentPage-1)*numCommentPerPage+CommentsCounter;
  return(numEntryCommentRecount);
}
function showPaginating(span_id, content){
  if(content != '')
  {content = 'Page:&nbsp;' + content;}
  updateDivContent(span_id, content);
}
function commentPagination(url, comment, printPaginating, pageNo, space){
  return commentPaginate('commentpaging', url, comment, printPaginating, pageNo, space);
}
function getPostPaginating(json){
  var numCmnts = json.feed.openSearch$totalResults.$t;
  commentPagination(strPostURL, numCmnts, 1, false, '&nbsp;');
  document.write('&nbsp;('+numCmnts+')');
}
function remakePaginating(){
  var pageHref = document.location.href;
  if(pageHref.split('/')[4]){ // Update pages but Main
    strPagination = strPagination.replace(/\&nbsp;/gi,'');
    if(!pageHref.match('/p/')){ // For "Post", not "Page"
      showPaginating("commentpaging-head", strPagination);
    }else{
      // Recount <numEntryCommentRecount>
      recountTotalComments();
      if(numEntryCommentRecount%numCommentPerPage>0){
        // Update <strPagination>
        commentPagination(pageHref.split('.html')[0]+'.html', numEntryCommentRecount, false, false, '');
        showPaginating("commentpaging-head", strPagination);
        showPaginating("commentpaging", strPagination);
      }else{
        showPaginating("commentpaging-head", strPagination);
      }
    }
  }
}
//
//////////////////////////////////////////////////
//
// Timer-functions:
//
function timedCount(showAlert, windowhost){
  showAlert = showAlert || false;
  windowhost = windowhost || window.location.hostname;
  if(timer_is_on == 1){
    $.getJSON(
    "https://"+windowhost+"/feeds/comments/default?redirect=false&max-results=1&alt=json-in-script&callback=?",
    {tags: "jquery,javascript", tagmode: "any", format: "json"},
    function(data){
      var counter = data.feed["openSearch$totalResults"].$t;
      var newComments = counter - totalComments;
      if(newComments>0){
        totalComments = counter;
        setcookie(cookieCount, totalComments, cookieDays);
        getRecentComments01();//LocalFunc
        if(showAlert){
          alert(newComments + " new comment(s) comming");
        }
      }
    });
  }
  timer = setTimeout(function(){ timedCount(showAlert, windowhost) }, timerInterval);
}
function doTimer(showAlert, windowhost){
  if(timer_is_on != 1){
    timer_is_on = 1;
    setAutoAlertMsg(msgCAAOn);
    setcookie(cookieName, 1, cookieDays);
    timedCount(showAlert, windowhost);
  }else{
    timer_is_on = 0;
    setAutoAlertMsg(msgCAAOff);
    setcookie(cookieName, 0, cookieDays);
  }
}
function setAutoAlertMsg(msg){
  document.getElementById("msgCommentAutoAlert").innerHTML = msg;
}
function doFloat(){
  if(nav_is_on != 1){
    nav_is_on = 1;
    setcookie(cookieNav, 1, cookieDays);
  }else{
    nav_is_on = 0;
    setcookie(cookieNav, 0, cookieDays);
  }
  setNavFloating(nav_is_on);
}
function setNavFloating(navOn){
  if(navOn == 1){
    setNavFloatingButton("spanNavFloatingButton", "blogPageTop", "comments", "blogPageBottom");
  }else{
    setNavFloatingButton("spanNavFloatingButton", 0);
  }
}
function setNavFloatingButton(nfbDiv, top, mid, bot){
  if(!mid){
    document.getElementById(nfbDiv).innerHTML = "";
  }else{
    var msgTop = '<a href="#'+top+'"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/team/gui/im_up.gif" border="0"/></a>';
    var msgMid = '<a href="#'+mid+'"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/team/gui/im_mid.gif" border="0"/></a>';
    var msgBot = '<a href="#'+bot+'"><img src="https://cdn.jsdelivr.net/gh/asinerum/project/team/gui/im_down.gif" border="0"/></a>';
    document.getElementById(nfbDiv).innerHTML = msgTop+msgMid+msgBot;
  }
}
//
//////////////////////////////////////////////////
//
// Misc-functions:
//
function showMainMenu(){
  divmenu = document.getElementById("divMainMenu");
  if(divmenu.innerHTML=="") divmenu.innerHTML=strMainMenu;
  else hideMainMenu();
}
function hideMainMenu(){
  divmenu = document.getElementById("divMainMenu");
  strMainMenu = divmenu.innerHTML;
  divmenu.innerHTML = "";
}
function getCommentQuote(author, cmtnum, cmtid){
  var cmtnumRef = getGoToCommentLocation(cmtnum, cmtid);
  return 'Ref: '+author+' <A HREF="'+cmtnumRef+'">('+cmtnum+')</A> \r\n\r\n';
}
function openCommentQuote(text,cmtInput='hiddenPostBody',cmtForm='hiddenCommentForm'){
  //{xuteng}
  db(cmtInput, text);
  document[cmtForm].submit();
}
function setCommentQuote(text){
  element = document.getElementById(idTextareaCommentPost);
  element.value = text;
  element.focus();
  element.setSelectionRange(element.value.length,element.value.length);
}
function getGoToCommentValue(inputId){
  if(!inputId){inputId='go-to-comment';}
  var cmtnum = document.getElementById(inputId).value;
  if(isNaN(cmtnum)||(!cmtnum)){cmtnum=1;}
  return cmtnum;
}
function getGoToCommentLocation(cmtnum, cmtid){
  if(!cmtid){cmthash='#cmt.'+cmtnum;}else{cmthash='#c'+cmtid;}
  return location.href.split('?')[0].split('#')[0]+'?commentPage='+Math.ceil(cmtnum/numCommentPerPage)+cmthash;
}
function setGoToComment(inputId){
  var cmtnum = getGoToCommentValue(inputId);
  location.hash = '#cmt.'+cmtnum;
}
function setGoToCommentExt(inputId){
  var cmtnum = getGoToCommentValue(inputId);
  location.href = getGoToCommentLocation(cmtnum);
}
function pickButton(hide, sdiv, ocfShow, ocfHide,
titleShow, titleHide, imgShow, imgHide, idShow, idHide){
  hide = hide || false;
  sdiv = sdiv || "divRecentCommentsButton";
  ocfShow = ocfShow || "getRecentComments01();";
  ocfHide = ocfHide || "clearRecentComments01();";
  titleShow = titleShow || "Show latest comments";
  titleHide = titleHide || "Hide latest comments";
  imgShow = imgShow || "https://cdn.jsdelivr.net/gh/asinerum/project/team/gui/icon_go_show.gif";
  imgHide = imgHide || "https://cdn.jsdelivr.net/gh/asinerum/project/team/gui/icon_back_hide.gif";
  idShow = idShow || "iRecentCommentShow";
  idHide = idHide || "iRecentCommentHide";
  title = hide ? titleHide : titleShow;
  img = hide ? imgHide : imgShow;
  id = hide ? idHide : idShow;
  ocf = hide ? ocfHide : ocfShow;
  shtm = "<a id='" + id + "' href='#' onclick='" + ocf + ";return(false);'><img border='0' title='" + title + "' src='" + img + "'/></a>";
  document.getElementById(sdiv).innerHTML = shtm;
}
//
//////////////////////////////////////////////////
//
////
// V2014.008A:
////
function updateCommentContent(tagName, tagClass, tagIdBase, headIdBase, textIdBase, hideCounter){
  var comments = [];
  var divs = document.getElementsByTagName(tagName);
  for(index=0; index<divs.length; index++){
    if(divs[index].getAttribute('class')==tagClass){
      var comment = {};
      comment.id = divs[index].getAttribute('id');
      comment.authorUrl = divs[index].getAttribute('authorUrl');
      comment.timestamp = divs[index].getAttribute('timestamp');
      comments.push(comment);
    }
  }
  for(var index=0; index<comments.length; index++){
     var coreId = comments[index].id.split(tagIdBase)[1];
     var headId = headIdBase + coreId;
     var textId = textIdBase + coreId;
     var comheadid = document.getElementById(headId);
     var comtextid = document.getElementById(textId);
     var cmtnum = ((numCommentPage-1)*numCommentPerPage + index + 1);
     var mrHead = showVIP(comments[index].authorUrl, 1, 24, ' ', 1, cmtnum, coreId);
     var mrText = getStyledComment(comments[index].authorUrl, '?', comments[index].timestamp, comtextid.innerHTML);
     if(!hideCounter){mrHead = '<A NAME="cmt.'+cmtnum+'"></A><I><FONT COLOR="#FF9966">('+cmtnum+')</FONT></I>' + mrHead;}
     comheadid.innerHTML = mrHead;
     comtextid.innerHTML = mrText;
  }
}
////
// V2014.010A:
////
function copytext(text){//25
  const temporaryTextArea = document.createElement('textarea');
  temporaryTextArea.value = text;
  temporaryTextArea.style.position = 'fixed';
  temporaryTextArea.style.height = '0';
  temporaryTextArea.style.opacity = '0';
  document.body.appendChild(temporaryTextArea);
  temporaryTextArea.select();
  try{
    document.execCommand('copy');
    console.log('COPIED:', temporaryTextArea.value);
  }catch(err){
    console.error('COPY FAILED:', err);
  }finally{
    document.body.removeChild(temporaryTextArea);
  }
}
function updateOneCommentHeader(bcId, idPrefix, authorUrl, hideCounter, authorName, editor=false){
  CommentsCounter++;
  var cmtnum = ((numCommentPage-1)*numCommentPerPage + CommentsCounter);
  var comheadid = document.getElementById(idPrefix+bcId);
  var comgoid = document.getElementById('cgo-'+bcId);
  var mrHead = showVIP(authorUrl, 1, 24, ' ', 1, cmtnum, bcId);
  var cmtid = bcId.split('-')[1]; // bcId:[_cmt-xxxxxx]
  if(!hideCounter){mrHead = '<A NAME="cmt.'+cmtnum+'"></A><I><FONT COLOR="#FF9966">('+cmtnum+')</FONT></I>' + mrHead;}
  comheadid.innerHTML = mrHead;
  var quote = `getCommentQuote(decodeURI('${authorName}'),${cmtnum},'${cmtid}')`;
  var gocmt = `<IMG HEIGHT="12" SRC="https://cdn.jsdelivr.net/gh/asinerum/project/team/gui/button.gif" TITLE="Go comment"/>`
  if(editor)
    comgoid.innerHTML = `<A HREF="javascript:quot=${quote};editorAppendHtml(quot);editorSetFocus()">${gocmt}</A>`;
  else{
    comgoid.innerHTML = `<A HREF="javascript:quot=${quote};copytext(quot);openCommentQuote(quot)">${gocmt}</A>`;
  }
}
function updateOneCommentHeader2(bcId, idPrefix, authorUrl, hideCounter, authorName){
  updateOneCommentHeader(bcId, idPrefix, authorUrl, hideCounter, authorName, true)
}
function updateOneCommentContent(bcId, idPrefix, authorUrl, timestamp){
  var comtextid = document.getElementById(idPrefix+bcId); if(!comtextid)return;
  var mrText = getStyledComment(authorUrl, '?', timestamp, comtextid.innerHTML);
  comtextid.innerHTML = mrText;
}
function updateOneBloggerComment(bcId, idPrefix){
  var comid = document.getElementById(idPrefix+bcId);
  var authorUrl = comid.getAttribute('authorUrl');
  var authorName = comid.getAttribute('authorName');
  var timestamp = comid.getAttribute('timestamp');
  if(!DEF_HIDE_STAMPS){
    func = typeof(DEF_USE_BUILTIN_EDITOR)==='undefined' ? updateOneCommentHeader : updateOneCommentHeader2;
    func(bcId, 'is-', authorUrl, DEF_HIDE_COUNTS, authorName);
  }
  updateOneCommentContent(bcId, 'ss-', authorUrl, timestamp);
}
//
//////////////////////////////////////////////////
//
//25
//
globalThis.revertEXTags = function(text){
  text = text.exrevtagcolon('fo', '<font\n', '</font>');
  text = text.exrevtagcolon('ss', '<span style=', '</span>');
  text = text.exrevtagequal('al', '<div align=', '</div>');
  text = text.exrevtagequal('bg', '<span style=background-color:', '</span>');
  text = text.exrevtagequal('fa', '<font face=', '</font>');
  text = text.exrevtagequal('si', '<font zise=', '</font>');
  text = text.exrevtagequal('co', '<font color=', '</font>');
  text = text.sxrevtagequal('xut', '<b class="xut-', '"></b>');
  text = text.sxrevtagequal('xga', '<b class="xga-', '"></b>');
  return text;
}
globalThis.revertXTags = function(text){
  const style = 'style="max-width: 100%; height: auto;"'
  text = text.xrevtag('im', `<img ${style} src="`, '"/>');
  text = text.xrevtag('img', `<img ${style} src="`, '"/>');
  text = text.xrevtag('fim', `<img ${style} src="`, '"/>');
  text = text.xrevtag('image', `<img ${style} src="`, '"/>');
  text = text.xrevtag('ifr', `<iframe ${style} src="`, '"></iframe>');
  text = text.xrevtag('ac', '<div align=center>', '</div>');
  text = text.xrevtag('ar', '<div align=right>', '</div>');
  text = text.xrevtag('xut', '<b class="xut-', '"></b>');
  text = text.xrevtag('xga', '<b class="xga-', '"></b>');
  return text;
}
globalThis.revertTags = function(text, longs=standardLongTags, shorts=standardShortTags){
  longs.split(',').forEach(tag=>{text=text.revtagex(tag, tag)});
  shorts.split(',').forEach(tag=>{text=text.revtag(tag, tag)});
  return removeFontSize(revertXTags(revertEXTags(text)));
}
globalThis.escapeTags = function(text, longs=standardLongTags, shorts=standardShortTags){
  longs.split(',').forEach(tag=>{text=text.longreptag(tag, tag)});
  shorts.split(',').forEach(tag=>{text=text.shortreptag(tag, tag)});
  return text;
}
//
//////////////////////////////////////////////////