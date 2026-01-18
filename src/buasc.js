// CLI Version

const jd = require('jsdom-global')();

const urlJsonData1 = 'https://cdn.jsdelivr.net/gh/asinerum/project/team/buas.json';
const urlJsonData2 = 'https://asinerum.github.io/project/team/buas.json';

const LOADED = 'Config loaded';

let ACTIVE_JSON_URL = urlJsonData1;

globalThis.members;

globalThis.loadMembers = function (cbf=console.log, url=ACTIVE_JSON_URL) {
  // Require <xmlhttprequest> installed
  // or just got from JSDOM-GLOBAL
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      cbf(null, xhr.response.members);
    } else {
      cbf(status, null);
    }
  }
  xhr.send();
}

globalThis.loadMembersSync = function (url=ACTIVE_JSON_URL) {
  // Require <xmlhttprequest> installed
  // or just got from JSDOM-GLOBAL
  let xhr = new XMLHttpRequest();
  try {
    xhr.open('GET', url, false);
    xhr.send(null);
    if (xhr.status === 200) {
      console.log(LOADED);
      return JSON.parse(xhr.responseText).members;
    }
  } catch(err) {
    console.error(`ERROR: ${err}`);
  }
}

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

globalThis.loadMembersAsync = function (url=ACTIVE_JSON_URL) {
  (async () => {
    try {
      const data = await fetchData(url);
      members = data.members;
      syncMembers(members);
      console.log(LOADED);
    } catch(err) {
      console.error(`ERROR: ${err}`);
    }
  })();
}

function syncMembers (mbr) {
  globalThis.numIndexVip1 = mbr.numIndexVip1;
  globalThis.numIndexVip2 = mbr.numIndexVip2;
  globalThis.UserVIPs = mbr.UserVIPs;
  globalThis.UserBLs = mbr.UserBLs;
}

members = loadMembersSync();
syncMembers(members);
