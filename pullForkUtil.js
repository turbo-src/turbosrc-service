const simpleGit = require('simple-git');
const sha256 = require('crypto-js/sha256');
const fs = require('fs')
const tar = require('tar');
const { exec } = require('child_process');
const childProcess = require("child_process");
const { getPullRequest } = require('./gitHubUtil');
const { gitHeadUtil } = require('./gitHeadUtil');

/**
 * @param {string} command A shell command to execute
 * @return {Promise<string>} A promise that resolve to the output of the shell command, or an error
 * @example const output = await execute("ls -alh");
 */
function execute(command) {
  /**
   * @param {Function} resolve A function that resolves the promise
   * @param {Function} reject A function that fails the promise
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  return new Promise(function(resolve, reject) {
    /**
     * @param {Error} error An error triggered during the execution of the childProcess.exec command
     * @param {string|Buffer} standardOutput The result of the shell command execution
     * @param {string|Buffer} standardError The error resulting of the shell command execution
     * @see https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
     */
    childProcess.exec(command, function(error, standardOutput, standardError) {
      if (error) {
        reject();

        return;
      }

      if (standardError) {
        reject(standardError);

        return;
      }

      resolve(standardOutput);
    });
  });
}

async function getSha256Fork(baseDir, fork) {
  let result = await execute(`sha256sum ${baseDir}/${fork}.tgz`)
  let forkSha256 = result.split(' ')[0]
  return forkSha256
}

async function tarRepo(baseDir, fork) {
  await execute(`tar --mtime='1999-12-25 00:00:00' -Jcf ${baseDir}/${fork}.tgz ${baseDir}/${fork}`)
}

//Right now it just makes the dir with oid as a name.
const pullForkUtil = {
  // Fork is the issue_id or other uuid of fork from pull request.
  pullForkUtil: async function(repo, forkOid, url, branch) {
    const baseDir = 'repos/' + repo
    const dir = baseDir + '/' + forkOid;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    //const options = {
    //   baseDir: process.cwd() + '/' + dir,
    //   binary: 'git',
    //   maxConcurrentProcesses: 6,
    //};

    //const git = simpleGit(options);

    //await git.init();
    //console.log(url)
    //console.log(branch)
    //try {
    //   await git.addRemote('origin', url)
    //} catch {
    //  console.log('remote may already exist')
    //}
    //try {
    //  await git.fetch(['origin', branch]);
    //} catch {
    //  console.log('fetch failed')
    //}
    //await git.checkout(branch);

    //const gitDir = dir + '/.git'
    //// delete directory recursively
    //await fs.promises.rm(gitDir, { recursive: true }, (err) => {
    //  if (err) {
    //      throw err;
    //  }

    //  console.log(`${gitDir} is deleted!`);
    //});

    ////await new Promise(resolve => setTimeout(resolve, 3000));
    //await tarRepo(baseDir, forkOid)
    ////await new Promise(resolve => setTimeout(resolve, 5000));
    //const forkSha256 = await getSha256Fork(baseDir, forkOid)


    //return forkSha256
  },
  getPullRequestSha256: async function(repo, fork, branch) {
     // sha256
  },
  getPRhead: async(args) => {
    const pr_id = args.pr_id
    // User should do this instead and pass it in request so we don't overuse our github api.
    console.log('owner ' + args.owner)
    console.log('repo ' + args.repo)
    console.log('pr_id ' + pr_id.split('_')[1])
    var baseRepoName = args.repo
    var baseRepoOwner = args.owner
    var resGetPR = await getPullRequest(baseRepoOwner, baseRepoName, pr_id.split('_')[1])
    var pullReqRepoHead = await gitHeadUtil(resGetPR.contributor, baseRepoName, resGetPR.forkBranch, 0)

    return [resGetPR, pullReqRepoHead]
  }
}

module.exports = pullForkUtil