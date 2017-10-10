if (process.argv[2] === undefined || process.argv[3] === undefined) {
  console.error("ERROR: No arguments provided. Correct usage is \"node download_avatars.js <repo_owner> <repo_name>\"");
  process.exit();
}

var repoOwner = process.argv[2];
var repoName = process.argv[3];

var request = require("request");
var https = require("https");
var fs = require("fs");
var imageType = require("image-type");

var GITHUB_USER = "jong86";
var GITHUB_TOKEN = "e508af8416da135ae64457edbe016e70b0c11e09";


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = "https://" + GITHUB_USER + ":" + GITHUB_TOKEN + "@api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";
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

var totalDownloaded = 0;
function downloadImageByUrl(url, filePath, totalImages) {
  var ext;
  request(url)
    .on("error", function(err) {
      console.log(`Error downloading image at ${url}`);
    })
    .on("response", function(response) {
      // Store file extension for naming file:
      ext = response.headers["content-type"].slice(6);
    })
    .pipe(fs.createWriteStream(`avatars/${filePath}`))
    .on("finish", function() {
      totalDownloaded += 1;
      var percent = Math.floor(totalDownloaded / totalImages * 100);
      console.log(`Finished downloading image "${filePath}.${ext}" -- ${percent}% complete`);
      // Rename file with proper extension after creating it:
      fs.rename(`avatars/${filePath}`, `avatars/${filePath}.${ext}`, function(err) {
        if(err) { console.log("ERROR: " + err); }
      });
    });
}

function cbContributors(err, result) {
  if (err !==  null) {
    console.log("Errors:", err, "\n");
  }
  let data = JSON.parse(result);
  for (let i = 0; i < data.length; i++) {
    downloadImageByUrl(data[i].avatar_url, data[i].login, data.length);
  }
}

getRepoContributors(repoOwner, repoName, cbContributors);

