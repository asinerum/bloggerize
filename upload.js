const fs = require('fs');

const blogger = require('bloggerize/upload');

const ARCHIVE_URL = 'https://comment-archive.blogspot.com';
const ARCHIVE_BLOG_ID = '8254806400148362373';

const PTE_ARCHIVE_URL = '';
const PTE_ARCHIVE_BLOG_ID = '';

const publicUploadList = './list.upload.txt';
const privateUploadList = './list.upload.pte.txt';

const pathPublicHtml = './comment-archive';
const pathPrivateHtml = './comment-archive.pte';

function filesBeUploaded (list=publicUploadList) {
  try {
    const files = fs.readFileSync(list, 'utf8');
    return files.trim().split('\n').map(item => item.trim()).filter(item => item);
  } catch (err) {
    console.log('File Error:', err.message);
    process.exit(0);
  }
}

async function run (pte=false, draft=false, blog_id=ARCHIVE_BLOG_ID) {
  const publicBeUploaded = filesBeUploaded(publicUploadList);
  const privateBeUploaded = filesBeUploaded(privateUploadList);
  if ((pte && privateBeUploaded.length === 0) ||
      (!pte && publicBeUploaded.length === 0)) {
    console.log('No posts to be uploaded');
  } else {
    console.log('Starting to upload posts..');
    if (pte) await upload(privateBeUploaded, pathPrivateHtml, draft, blog_id);
    else { await upload(publicBeUploaded, pathPublicHtml, draft, blog_id); }
  }
}

async function upload (filelist, frompath, draft=false, blog_id=ARCHIVE_BLOG_ID) {
  filelist = filelist.map(item => `${frompath}/${item}`);
  if (filelist.length === 0) return console.log('No files to post');
  await blogger.insertPosts(filelist, draft, blog_id);
  console.log('Done');
}

////////////////////////////////////////////////////////////////

let DEF_READ_FOLDER = pathPublicHtml;
let thefile = process.argv[2];

let archive_blog_url = ARCHIVE_URL;
let archive_blog_id = ARCHIVE_BLOG_ID;
let read_folder = DEF_READ_FOLDER;
let private_upload = false;

let args = process.argv[3];
if (args) {
  args = args.extractInput();
  read_folder = args.dir || read_folder;
  archive_blog_url = args.url || archive_blog_url;
  private_upload = args.pte || private_upload; // Use with cares
  (async () => {archive_blog_id = await(blogId(archive_blog_url))})();
}

if (thefile) {
  (async () => await upload(thefile.split(',').map(item => item.trim()).filter(item => item), read_folder, false, archive_blog_id))();
} else {
  (async () => await run(private_upload, false, archive_blog_id))();
}

////////////////////////////////////////////////////////////////