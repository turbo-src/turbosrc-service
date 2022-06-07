const { Octokit, App } = require("octokit");
const fsPromises = require('fs').promises;
const fs = require('fs').promises;

async function getGithubToken() {
    const data = await fsPromises.readFile('/usr/src/app/.config.json')
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let user = json.github.user
    let apiToken = json.github.apiToken
    if (apiToken === undefined) {
      throw new Error("Failed to load Github user " + user + "'s api key.");

    } else {
      console.log("Successfully read Github " + user + "'s api key.");
    }

    return apiToken

}

const gitHeadUtil = {
  gitHeadUtil: async function(owner, repo, forkBranch, headMinusNum) {
    let token = await getGithubToken();
     const octokit = new Octokit({ auth: token });
     var resCommits;
     var dataCommits
     var head
     console.log('here gh14: ' + forkBranch)
     try {
       // commits/master is different than commits.
       // What about main and if someone has a master and
       // main branch?
       if (forkBranch === '' || forkBranch === 'master') {
         resCommits = await octokit.request(`GET /repos/${owner}/${repo}/commits`)
         dataCommits = resCommits.data
         head = Object.entries(dataCommits)[headMinusNum][1].sha
       } else {
         resCommits = await octokit.request(`GET /repos/${owner}/${repo}/commits/${forkBranch}`)
         dataCommits = resCommits.data
         head = Object.entries(dataCommits)[headMinusNum][1]
       }
       return head
     } catch (err) {
       if (err.status === 404) {
         return 404
       } else {
         throw error
       }
       console.error(err.status)
     }
  }
}


module.exports = gitHeadUtil