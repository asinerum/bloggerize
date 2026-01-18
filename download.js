const fs = require('fs');

let args = process.argv[2];

if (!args) {
  console.log(`
  Mandatory argument is missing
  Usage syntax:
  node download.js "from:<FromDate>, to:[ToDate], page:[FromPage], pages:[Pages], dir:[ArchiveFolder], pte:[PrivateIndex], pdir:[PrivateArchiveFolder], url:[BlogURL]"
  `);
  process.exit(0);
}

require('bloggerize/loadlib');

const { extractBlog, COMMENTS_PER_PAGE } = require('bloggerize/download');

const BLOG_URL = 'https://an-hoang-trung-tuong-2014.blogspot.com';

const PUBLIC_FOLDER = 'comment-archive';
const PRIVATE_FOLDER = 'comment-archive.pte';

args = args.extractInput();

const fromdate = args.from || '';
const frompage = Number(args.page) || 1;
const todate = args.to || fromdate;
const pages = Number(args.pages) || 1;
const pteindex = Number(args.pte) || 0;
const url = args.url || BLOG_URL;
const limit = Number(args.lim) || COMMENTS_PER_PAGE;
const newest = args.filo || false;
const folder = args.dir || PUBLIC_FOLDER;
const ptefolder = args.pdir || PRIVATE_FOLDER;

folder.createFolder();
ptefolder.createFolder();

async function main () {
  const entries = await extractBlog(fromdate, frompage, {todate, pages, url, limit, newest, pteindex});
  if (!Array.isArray(entries)) {
    console.log(`
    No valid posts found, program stopped
    `);
    process.exit(0);
  }
  for (const entry of entries) {
    const file = (pteindex == 1) ? `${ptefolder}/${entry.file}` : `${folder}/${entry.file}`;
    try {
      if (entry.vol > 0) {
        fs.writeFileSync(file, entry.html);
        console.log(entry.file, '..done');
      } else {
        console.log(entry.file, '..ignored');
      }
    } catch (err) {
      console.log(entry.file, '..failed read/write');
    }
  }
  console.log('All done');
}

main();
