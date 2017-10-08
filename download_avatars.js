const repoOwner = process.argv[2];
const repo = process.argv[3];

const log = console.log;

const request = require("request");

var options = {
  url: `https://api.github.com/repos/${repoOwner}/${repo}/contributors`,
  headers: {
    "User-Agent": "jong86"
  }
};

function callbackContributors(error, response, body) {
  if (!error && response.statusCode == 200) {
    let info = JSON.parse(body);
    for (let i = 0; i < info.length; i++) {
      console.log(info[i].login);
    }
  }
}

request(options, callbackContributors);

//options.url = `URL_FOR_EACH_CONTRIBUTOR`;
