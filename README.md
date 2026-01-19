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

11. Download CREDENTIALS.JSON file.

12. Save APIKEY.JSON and CREDENTIALS.JSON files to your Node JS Blogger project folder.

### Login

Run:

> node login.js

And follow the scripts prompts to generate TOKEN.JSON file that saves your Google Cloud login token. This token will never expire once your project is published.

### Download Blogger Posts

Run:

> node download.js "from: DD/MM/YYYY, to: DD/MM/YYYY, url: YOUR_BLOG_URL, page: PAGE_NO, pages: NUM_PAGES"

PAGE_NO default value is 1;
NUM_PAGES default value is 1;

### Upload Blogger Posts

Run:

> node upload.js "UPLOAD_FILES_LIST" "url: YOUR_BLOG_URL"

UPLOAD_FILES_LIST can be arranged in LIST.UPLOAD.TXT file;

### Delete Blogger Posts

Run:

> node delete.js "from: DD/MM/YYYY, to: DD/MM/YYYY, blog: YOUR_BLOG_ID"

YOUR_BLOG_ID can be retrieved by running this code:

> require('bloggerize/blogger.format.gd3.js');
> console.log(await blogId(YOUR_BLOG_URL));

(C)2026 ASINERUM PROJECT TEAM
