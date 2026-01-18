/**

This tiny script creates Google Access Token for you to launch Blogger API tasks.
You have to do the following steps at Google Cloud Console:
  1. Create new project, pick it when done, or pick another existing project;
  2. Enable Blogger API V3 service for the project;
  3. Go to IAM tab on Project Settings menu. Review all project's users;
  4. Add new user for the project, pick it, or pick any existing user;
  5. Create and download Credentials JSON file of the picked user;
Then do these steps at your home machine:
  1. Save the downloaded file "credentials.json" in your working folder;
  2. Run this script. Follow its prompts;
  3. Wait for the file named "token.json" being created;
  4. Two files "credentials.json" and "token.json" must be kept safely.

*/

const blogger = require('bloggerize/upload');

blogger.authorizeThru((res) => {
  if (res) console.log('Done');
  else { console.log('An error has occured'); }
});
