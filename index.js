const myConfig = require('./bin/config')
// Simple-git without promise
const simpleGit = require('simple-git')();
// Simple Git with Promise for handling success and failure
const simpleGitPromise = require('simple-git/promise')();

// Repo name
// const repo = 'jeroushubot';  //Repo name
// User name and password of your GitHub
// const userName = myConfig.github.username;
// const password = myConfig.github.password;
// Set up GitHub url like this so no manual entry of user pass needed
// const gitHubUrl = `https://${userName}:${password}@github.com/${userName}/${repo}`;
// add local git config like username and email
// simpleGit.addConfig('user.email',myConfig.github.email);
// simpleGit.addConfig('user.name','Jerous');
// // Add remore repo url as origin to repo
// simpleGitPromise.addRemote('origin',gitHubUrl);
// Add all files for commit
simpleGitPromise.add('.');
// Commit files as Initial Commit
simpleGitPromise.commit('Intial commit by simplegit')
.then((successCommit) => {
  console.log(successCommit);
}, (failed) => {
  console.log('failed commmit');
});
// Finally push to online repository
simpleGitPromise.push('origin','master')
.then((success) => {
  console.log('repo successfully pushed');
},(failed)=> {
  console.log('repo push failed');
});
