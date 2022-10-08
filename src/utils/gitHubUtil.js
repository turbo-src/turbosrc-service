const { Octokit, App } = require("octokit");
const fsPromises = require('fs').promises;
const fs = require('fs').promises;
var path = require("path");
const { postGetContributorName } = require('./requests');
const {
	getJWT,
        getTurbosrcMode
} = require('./config')

require("dotenv").config();
const jwt = require("jsonwebtoken");

const gitHubUtil = {

getGithubToken: async function() {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
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
},
verify: async function(contributor_id, token){
  const onlineMode = await getTurbosrcMode()
  if (onlineMode !== 'online') {
    console.log('verify offline (default true)')
    return true
  } else {
    const jwtTokenFromConfig = await getJWT()
    console.log('contributor: ', contributor_id)
    console.log('jwtToken from Config: ', jwtTokenFromConfig)
    const tokenRes = jwt.verify(token, jwtTokenFromConfig)
    console.log('decrypted jwtToken from Config: ', tokenRes)
    try {
      if(!contributor_id || !token) {
        return false
      }
      // Trade contributor_id for our contributor_name in our PG database
      // If contributor_name in ags above, then it is a createUser

      let githubUsername = await postGetContributorName("","","",contributor_id)


      console.log("")
      console.log('inside verify try catch')
      console.log("")
      //const jwtTokenFromConfig = await getJWT()
      //console.log('jwtToken from Config: ', jwtTokenFromConfig)
      //const tokenRes = jwt.verify(token, jwtTokenFromConfig)
      //console.log('decrypted jwtToken from Config: ', tokenRes)

      const octokit = new Octokit({ auth: tokenRes.githubToken });

      // Request Github user info with token got from Github, stored in Chrome storage while using extension
      const res = await octokit.request(`GET /users/${githubUsername}`)

      // If res was successful and was querying the user associated with the contributor_id return true
      return Promise.resolve(res).then((object) => {
        if(githubUsername === object.data.login) {
          console.log('verified token thru github')
          return true
        } else {
          console.log('github token invalid', token)
          return false
        }
       })

    } catch (error) {
      console.log('error verifying github token', token)
      return 500
    }
  }
},
  getGitHubPullRequest: async function(owner, repo, pull) {
    let token = await module.exports.getGithubToken();

  
    const jwtTokenFromConfig = await getJWT()
    const tokenRes = jwt.verify(token, jwtTokenFromConfig)

    const octokit = new Octokit({ auth: tokenRes.githubToken });
    console.log('token', token,'tokenRes:', tokenRes)
    console.log('gh 19')
    console.log(owner)
    console.log(repo)
    console.log(pull)
    try {
      const res = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pull}`)//, {
      console.log('gh 21')
      //await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      //  owner: 'octocat',
      //  repo: 'hello-world',
      //  pull_number: 42
      //})
      //console.log(res)

      const data = res.data

      return data
    } catch (error) {
      return error
    }
  }, 
  getPullRequest: async function(owner, repo, pull) {
    let token = await module.exports.getGithubToken();

    const jwtTokenFromConfig = await getJWT()
    const tokenRes = jwt.verify(token, jwtTokenFromConfig)

    const octokit = new Octokit({ auth: tokenRes.githubToken });

    console.log('gh 19')
    console.log(owner)
    console.log(repo)
    console.log(pull)
    const res = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pull}`)//, {
    console.log('gh 21')
    //await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
    //  owner: 'octocat',
    //  repo: 'hello-world',
    //  pull_number: 42
    //})
    //console.log(res)

    const data = res.data
    const head = data.head
    const oid = head.sha
    const label = head.label.split(':')
    const contributor = label[0]
    const forkBranch = label[1]
    console.log(label)

    return { oid, contributor, forkBranch }
  },
  createPullRequest: async function(owner, repo, forkBranch, pull, title) {
    let token = await module.exports.getGithubToken();

    const jwtTokenFromConfig = await getJWT()
    const tokenRes = jwt.verify(token, jwtTokenFromConfig)

    const octokit = new Octokit({ auth: tokenRes.githubToken });
    console.log('gh 46')
    console.log(owner)
    console.log(repo)
    console.log(forkBranch)
    console.log(pull)

    await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
      owner: owner,
      repo: repo,
      title: title,
      body: "auto pull request",
      head: forkBranch,
      base: "master"
    })
    console.log('gh 58`')
  },
  closePullRequest: async function(owner, repo, pull) {
    let token = await module.exports.getGithubToken();
    const jwtTokenFromConfig = await getJWT()
    const tokenRes = jwt.verify(token, jwtTokenFromConfig)

    const octokit = new Octokit({ auth: tokenRes.githubToken });
    console.log('gh 64')
    console.log(owner)
    console.log(repo)
    console.log(pull)

    await octokit.request(`PATCH /repos/${owner}/${repo}/pulls/${pull}`, {
      state: "closed",
      //base: 'master'
    })
    //await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
    //  owner: 'octocat',
    //  repo: 'hello-world',
    //  pull_number: 42,
    //  title: 'title'
    //})
    console.log('gh 51`')
  },
  mergePullRequest: async function(owner, repo, defaultHash) {
    let token = await module.exports.getGithubToken();
    const jwtTokenFromConfig = await getJWT()
    const tokenRes = jwt.verify(token, jwtTokenFromConfig)

    const octokit = new Octokit({ auth: tokenRes.githubToken });
    console.log('gh 67')
    console.log(owner)
    console.log(repo)
    console.log(defaultHash)
    const pull = defaultHash

    const res = await octokit.request(`PUT /repos/${owner}/${repo}/pulls/${pull}/merge`, //{
      //owner: 'octocat',
      //repo: 'hello-world',
      //pull_number: 42,
      //commit_title: 'commit_title'
    //}

    )

    console.log('gh 83`')
  },
  fork: async function(owner, repo, org) {
    let token = await module.exports.getGithubToken();
    const jwtTokenFromConfig = await getJWT()
    const tokenRes = jwt.verify(token, jwtTokenFromConfig)

    const octokit = new Octokit({ auth: tokenRes.githubToken });
    console.log('gh 102')
    console.log(owner)
    console.log(repo)
    console.log(org)

    //await octokit.rest.repos.createFork({owner, repo, org})
    await octokit.rest.repos.createFork({owner, repo})

    //await octokit.request(`PUT /repos/${owner}/${repo}/fork`, {
    //  organization: org,
    //  //repo: 'hello-world',
    //  //pull_number: 42,
    //  //commit_title: 'commit_title'
    //})

    console.log('gh 116`')
  },
}

module.exports = gitHubUtil
