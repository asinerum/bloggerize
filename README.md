# BLOGGERIZE TINY BLOGGER ARCHIVING TOOLKIT
> v1.0.0

## Features

1. Programmatically download Blogger blog posts including comments as HTML formatted pages.
2. Programmatically upload HTML documents to a Blogger blog as new posts.
3. Programmatically delete Blogger blog posts.

## Installation

> npm i bloggerize

## Usage

### Prerequisites

1. Go to Google Cloud Console.

2. Sign in to your Google account if prompted.

3. Select a project. If you don't have one, create new one.

4. Select APIs & Services option from dropdown menu.

5. Enable the Blogger API in Library page.

6. Go to Credentials page.

7. Click Create Credentials link, then choose API Key.

8. Copy the new API key, and put it into APIKEY.JSON file.

9. Click Create Credentials link once again, this time choose OAuth Client ID.

10. Choose Desktop App application type, name the client, then hit Create button.

11. Download CREDENTIALS.JSON file associated with the new OAuth client.

12. Save APIKEY.JSON and CREDENTIALS.JSON files to your Node JS Blogger project folder.

### Login

Run:

> node login.js

And follow the scripts prompts to generate TOKEN.JSON file that saves your Google Cloud login token. This token will never expire once your project is published.

### Download Blogger Posts

Run:

> node download.js "from: DD/MM/YYYY, to: DD/MM/YYYY, url: YOUR_BLOG_URL, page: PAGE_NO, pages: NUM_PAGES"

PAGE_NO (comments starting page) default value is 1;   
NUM_PAGES (total number of pages) default value is 1;   
You can change all above default values by editing the very file DOWNLOAD.JS;

For example:

> node download.js "from: 15/12/2024, to: 31/1/2025, url: https://myblog.blogspot.com, page: 2, pages: 5"

### Upload Blogger Posts

Run:

> node upload.js "UPLOAD_FILES_LIST" "url: YOUR_BLOG_URL, dir: YOUR_ARCHIVE_FOLDER"

YOUR_ARCHIVE_FOLDER default value is "./comment-archive";   
You can change all above default values by editing the very file UPLOAD.JS;

For example:

> node upload.js "file01.html, file02.html, file13.html" "url: https://myblog.blogspot.com"

Or run UPLOAD.JS with no arguments:

> node upload.js

For this case, the UPLOAD_FILES_LIST must be arranged in the text file named LIST.UPLOAD.TXT, one by one line;   
And YOUR_BLOG_URL string value must be set in the file UPLOAD.JS also;

### Delete Blogger Posts

Run:

> node delete.js "from: DD/MM/YYYY, to: DD/MM/YYYY, blog: YOUR_BLOG_ID"

YOUR_BLOG_ID can be retrieved by running this code:

```ts
require('bloggerize/blogger.format.gd3.js');   
console.log(await blogId(YOUR_BLOG_URL));   
```

For example:

> node delete.js "from: 15/12/2024, to: 31/1/2025, blog: 8254806400148362373"

(C)2026 ASINERUM PROJECT TEAM
