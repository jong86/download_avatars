// To use in CLI: node download_avatars.js <repo_owner> <repo_name>

if (process.argv[2] === undefined || process.argv[3] === undefined || process.argv.length >= 5) {
  console.error("ERROR: Incorrent number of arguments provided. Correct usage is \"node download_avatars.js <repo_owner> <repo_name>\"");
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
  GITHUB_TOKEN = process.env.DB_TOKEN;
} else {
  console.log("DB_TOKEN not defined in .env file. Program closing.");
  process.exit();
}

var requestURL = "https://" + GITHUB_USER + ":" + GITHUB_TOKEN + "@api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors";

fs.access('./.env', fs.F_OK, function (err) {
  if (err) {
    console.log("Cannot find .env file. Program closing.");
    process.exit();
  }
});

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: requestURL,
    headers: {
      "User-Agent": "jong86"
    }
  };
  // Creates folder if doesn't already exist:
  fs.existsSync("avatars") || fs.mkdirSync("avatars");
  request(options, function(err, res, body) {
    cb(err, res, body);
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
    // Create image file:
    .pipe(fs.createWriteStream(`avatars/${filePath}`))
    .on("finish", function() {
      totalDownloaded += 1;
      var percent = Math.floor(totalDownloaded / totalImages * 100);
      console.log(`Finished downloading image "${filePath}.${ext}" -- ${percent}% complete`);
      // Rename image file with proper extension after creating it:
      fs.rename(`avatars/${filePath}`, `avatars/${filePath}.${ext}`, function(err) {
        if(err) { console.log("ERROR: " + err); }
      });
    });
}

function cbContributors(err, res, result) {
  if (err !==  null) {
    console.log("Errors:", err, "\n");
  }
  let data = JSON.parse(result);
  if (res.statusCode === 404) {
    console.log("Repo not found.");
    process.exit();
  } else if (res.statusCode === 401) {
    console.log("Invalid token.");
    process.exit();
  };
  // Loop through data for each contributor:
  for (let i = 0; i < data.length; i++) {
    downloadImageByUrl(data[i].avatar_url, data[i].login, data.length);
  }
}

getRepoContributors(repoOwner, repoName, cbContributors);

