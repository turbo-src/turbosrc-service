const { Octokit, App } = require("octokit");
const fsPromises = require('fs').promises;
const fs = require('fs').promises;

async function getGithubToken() {
    const data = await fsPromises.readFile('.github-token')
                       .catch((err) => console.error('Failed to read file', err));

    return data.toString().replace(/\n*$/, "");

}

const gitHubUtil = {
  getPullRequest: async function(owner, repo, pull) {
    let token = await getGithubToken();

    const octokit = new Octokit({ auth: token });

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
    let token = await getGithubToken();
    const octokit = new Octokit({ auth: token });
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
    let token = await getGithubToken();
    const octokit = new Octokit({ auth: token });
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
  mergePullRequest: async function(owner, repo, pull) {
    let token = await getGithubToken();
    const octokit = new Octokit({ auth: token });
    console.log('gh 67')
    console.log(owner)
    console.log(repo)
    console.log(pull)

    await octokit.request(`PUT /repos/${owner}/${repo}/pulls/${pull}/merge`, //{
      //owner: 'octocat',
      //repo: 'hello-world',
      //pull_number: 42,
      //commit_title: 'commit_title'
    //}
    )

    console.log('gh 83`')
  },
  fork: async function(owner, repo, org) {
    let token = await getGithubToken();
    const octokit = new Octokit({ auth: token });
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