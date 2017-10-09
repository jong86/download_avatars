var repoOwner = process.argv[2];
var repoName = process.argv[3];

var log = console.log;

var request = require("request");
var fs = require('fs');


var GITHUB_USER = "jong86";
var GITHUB_TOKEN = "e508af8416da135ae64457edbe016e70b0c11e09";

var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

function getRepoContributors(repoOwner, repoName, cb) {

  
}

console.log(requestURL);

getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});


// request(options, callbackContributors);

//options.url = `URL_FOR_EACH_CONTRIBUTOR`;
