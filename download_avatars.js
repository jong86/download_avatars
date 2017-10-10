var repoOwner = process.argv[2];
var repoName = process.argv[3];

var log = console.log;

var request = require("request");
var https = require('https');
var fs = require('fs');


var GITHUB_USER = "jong86";
var GITHUB_TOKEN = "e508af8416da135ae64457edbe016e70b0c11e09";




function getRepoContributors(repoOwner, repoName, cb) {
  
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var options = {
    url: requestURL,
    headers: {
      "User-Agent": "jong86"
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });
}


getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err, '\n');
  let data = JSON.parse(result);
  for (let i = 0; i < data.length; i++) {
    console.log(data[i].login + ": " + data[i].avatar_url)
    
  }

});


// request(options, callbackContributors);

//options.url = `URL_FOR_EACH_CONTRIBUTOR`;
