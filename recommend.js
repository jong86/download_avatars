// To use in CLI: node recommend.js <repo_owner> <repo_name>

if (process.argv[2] === undefined || process.argv[3] === undefined || process.argv.length >= 5) {
  console.error("ERROR: Incorrent number of arguments provided. Correct usage is \"node recommend.js <repo_owner> <repo_name>\"");
  process.exit();
}

require("dotenv").config();

var request = require("request");
var https = require("https");
var fs = require("fs");

var repoOwner = process.argv[2];
var repoName = process.argv[3];
var GITHUB_USER = "jong86";

if (process.env.DB_TOKEN) { 
  var GITHUB_TOKEN = process.env.DB_TOKEN;
} else {
  console.log("DB_TOKEN not defined in .env file. Program closing.");
  process.exit();
}

fs.access('./.env', fs.F_OK, function (err) {
  if (err) {
    console.log("Cannot find .env file. Program closing.");
    process.exit();
  }
});

function getRepoContributors(repoOwner, repoName, cb) {
  const requestURLContrib = "https://" + GITHUB_USER + ":" + GITHUB_TOKEN + "@api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
  const options = {
    url: requestURLContrib,
    headers: {
      "User-Agent": "jong86"
    }
  };
  request(options, (err, res, body) => {
    cb(err, res, body);
  });
}

let totalDownloaded = 0;
let string = "";
let starredAll = [];
let starredUnique;
function getStarredRepos(login) {
  const requestURLStarred = "https://" + GITHUB_USER + ":" + GITHUB_TOKEN + "@api.github.com/users/" + login + "/starred";
  const options = {
    url: requestURLStarred,
    headers: {
      "User-Agent": "jong86"
    }
  };
  let buffer = "";
  let starredByThisUser = [];
  request(options)
    .on("error", (err) => {
      console.log(`Error with getting starred repos ${url}`);
    })
    .on("data", (chunk) => {
      buffer += chunk.toString();
    })
    .on("end", () => {
      let starredListData = JSON.parse(buffer);
      for (let i = 0; i < starredListData.length; i++) {
        let repoName = JSON.parse(buffer)[i].full_name;
        starredByThisUser.push(repoName);
      }
      starredAll.length === 0 ? starredAll = starredByThisUser : starredAll = starredAll.concat(starredByThisUser);
      
      howManyContribsSoFar++;
      if (howManyContribsSoFar === numContribs) {
        starredUnique = makeUniqueOnly(starredAll);
        finalCount();
      }
    });
}

function makeUniqueOnly(arr) {
  var seen = {};
  return arr.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

function finalCount() {
  let starredCounts = [];
  for (let i = 0; i < starredUnique.length; i++) {
    starredCounts[i] = 0;
    for (let j = 0; j < starredAll.length; j++) {
      if (starredUnique[i] === starredAll[j]) {
        starredCounts[i] += 1;
      }
    }
  }
  console.log("-------------------------------");
  for (let i = 0; i < 5; i++) {
    let maxValue = Math.max(...starredCounts);
    // console.log("maxValue:", maxValue);
    let maxIndex = starredCounts.indexOf(maxValue);
    console.log("Stars:", starredCounts[maxIndex]);
    console.log("Repo:", starredUnique[maxIndex]);
    console.log("-------------------------------");
    starredCounts.splice(maxIndex, 1);
    starredUnique.splice(maxIndex, 1);
  }
}

let numContribs;
let howManyContribsSoFar = 0;
getRepoContributors(repoOwner, repoName, (err, res, result) => {
  if (err !==  null) {
    console.log("Errors:", err, "\n");
  }
  if (res.statusCode === 404) {
    console.log("Repo not found.");
    process.exit();
  } else if (res.statusCode === 401) {
    console.log("Invalid token.");
    process.exit();
  };
  let data = JSON.parse(result);
  numContribs = data.length;
  // Loop through data for each contributor:
  for (let i = 0; i < data.length; i++) {
    getStarredRepos(data[i].login);
  }
})