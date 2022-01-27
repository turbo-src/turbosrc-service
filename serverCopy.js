const fs = require('fs')
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const { createClient } = require('redis');
const superagent = require('superagent');
const { getPRhead } = require('./pullForkUtil');
const { getPullRequest } = require('./gitHubUtil');
const { gitHeadUtil } = require('./gitHeadUtil');
const { update } = require('tar');

var pullRequestsVoteCloseHistory;

var fakeTurboSrcReposDB;


var pullRequestsDB;

// Also a root 'methods' in graphql query, by the same name
function getPRvoteTotals(args) {
    const prID = args.pr_id.split('_')[1]

    const supply = fakeTurboSrcReposDB[args.owner + "/" + args.repo].supply
    const quorum = fakeTurboSrcReposDB[args.owner + "/" + args.repo].quorum

    const prFields = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID]

    var percentVotedQuorum

    if (prFields) {
      // Check if pull is halted
      // If no
      const totalVotedTokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens
      percentVotedQuorum = totalVotedTokens/supply
      c= totalVotedTokens/(supply*quorum)
    }

    return percentVotedQuorum
}

function getPRvoteStatus(args) {
    const prID = args.pr_id.split('_')[1]

    const supply = fakeTurboSrcReposDB[args.owner + "/" + args.repo].supply
    const quorum = fakeTurboSrcReposDB[args.owner + "/" + args.repo].quorum

    const prFields = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID]

    if (prFields) {
      // Check if pull is halted
      // If no
      const totalVotedTokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens
      const percentVoted = totalVotedTokens/supply
      var status;
      if (percentVoted >= quorum) {
        status = 'closed'
      } else {
        status = 'open'
      }
    } else {
      status = 'none'
    }

    return status
}

function updatePRvoteStatus(standardArgs, tokens) {
  const prID = standardArgs.pr_id.split('_')[1]
  const prVoteStatusNow = getPRvoteStatus(standardArgs)
  if (prVoteStatusNow === 'none') {
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID] = {}
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].pullRequestStatus = 'open'
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens = 0
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens = {}
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens.contributorID = {}
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id] = {
      tokens: 0,
      side: 'none'
    }
  }

  const totalVotedTokens = fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens

  const votedTokens = fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id].tokens

  //Add to vote tally. Creates pull request fields if needed.
  fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens = totalVotedTokens + tokens

  fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id].tokens = votedTokens + tokens

  fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id].side = standardArgs.side

  const prVoteStatusUpdated = getPRvoteStatus(standardArgs)

  fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID]['pullRequestStatus'] = prVoteStatusUpdated

  return prVoteStatusUpdated
}

// Probably unnecessary as setting vote will open pull
// request automatically if non exists, including same
// root 'method' for query.
function newPullRequest(args) {
  const prVoteStatus = getPRvoteStatus(args)
  const tokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].contributors[args.contributor_id]
  const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side
  pullRequestsDB[args.pr_id] = [vote_code]
  return pullRequestsDB[args.pr_id]
};

var root = {
  //getVote: (args) => {
  //  return pullRequestsDB[args.contributor_id]
  //},
  verifyPullRequest: async (arg) => {
    // Check if it's in our database
    // If not, fetch it.

    // redis.get(sha256)

    //return status
    //return fakeTurboSrcReposDB.includes(arg.repo_id)
  },
  getRepoStatus: async (arg) => {
    return Object.keys(fakeTurboSrcReposDB).includes(arg.repo_id)
  },
  getAuthorizedContributor: async (args) => {
    console.log(args.repo_id)
    console.log(args.contributor_id)
    const contributors = fakeTurboSrcReposDB[args.repo_id].contributors;
    const contributor_exists = Object.keys(contributors).includes(args.contributor_id)
    return contributor_exists
  },
  getVoteAll: async (pr_id) => {
    return pullRequestsDB[pr_id]
  },
  getVoteEverything: async () => {
    return JSON.stringify(pullRequestsDB)
  },
  getPRvoteStatus: async (args) => {
    var status = getPRvoteStatus(args)
    if (status === 'open' || status === 'none' ) {
      const prID = (args.pr_id).split('_')[1]
      const res = pullRequestsVoteCloseHistory.includes(prID)
      if (res) {
        status = 'closed'
      }
    }

    return status
  },
  getPRvoteTotals: async (args) => {
    return getPRvoteTotals(args)
  },
  getPRforkStatus: async (args) => {
    var res;
    const prID = (args.pr_id).split('_')[1]
    // User should do this instead and pass it in request so we don't overuse our github api.
    console.log('owner ' + args.owner)
    console.log('repo ' + args.repo)
    console.log('pr_id ' + prID)
    var baseRepoName = args.repo
    var baseRepoOwner = args.owner
    console.log(args.owner)
    console.log(baseRepoOwner)
    console.log(prID)
    var resGetPR = await getPullRequest(baseRepoOwner, baseRepoName, prID)
    console.log(resGetPR)
    var pullReqRepoHead = await gitHeadUtil(resGetPR.contributor, baseRepoName, resGetPR.forkBranch, 0)
    const baseDir = 'repos/' + args.repo;
    const pullForkDir = baseDir + '/' + pullReqRepoHead;

    console.log('pullReqRepoHead ' + pullReqRepoHead);

    // 404 means the repo doesn't exist on github, per api call.
    if (resGetPR !== 404 && pullReqRepoHead !== 404) {
    // Check if there is already a dir for the pull fork.
      if (!fs.existsSync(pullForkDir)) {
        res = "pull"
        console.log("pull")
      } else {
         res =  "valid"
         console.log("valid")
      }
    } else {
      res = "notOnGithub"
      console.log("notOnGithub")
    }
    console.log("final result")
    console.log(res)
    return res
  },
  pullFork: async (args) => {
    superagent
      .post('http://localhost:4001/graphql')
      .send(
        { query: `{ getPRfork(owner: "${args.owner}", repo: "${args.repo}", pr_id: "${args.pr_id}", contributor_id: "${args.contributor_id}") }` }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
    return "something"
  },
  setVote: async (args) => {
    const prID = (args.pr_id).split('_')[1]
    var exists = false

    // See if pull request is verified or needs to be.
    // verfify(pr_id)

    // Need:
    // owner
    // repo
    var forkSha256;
    var oid;
    var votedAlready;

    // User should do this instead and pass it in request so we don't overuse our github api.

    const activePullRequests = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests
    const numberActivePullRequests = Object.keys(activePullRequests).length

    if (numberActivePullRequests === 0) {
       fakeTurboSrcReposDB[args.owner + "/" + args.repo].openPullRequest = prID
    }

    const openPullRequest = fakeTurboSrcReposDB[args.owner + "/" + args.repo].openPullRequest

    const tokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].contributors[args.contributor_id]

    // We can only use the function if there asking for about a
    // specific pull request.
    console.log('owner ' + args.owner)
    console.log('repo ' + args.repo)
    console.log('pr_id ' + prID)
    console.log('tokens ' + tokens)


    const prVoteStatusNow = getPRvoteStatus(args)
    if (prVoteStatusNow === 'none') {
       votedAlready = false
    } else {
      const votedTokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID].votedTokens
      votedAlready = Object.keys(votedTokens).includes(args.contributor_id)
      console.log(args.contributor_id + ' voted already: ' + votedAlready)
    }

    const openPullRequestStatus = (openPullRequest === prID || openPullRequest === '');

    console.log('op pr status: ' + openPullRequestStatus)

    var [res, pullReqRepoHead] = await getPRhead(args)
    const alreadyHead = (pullReqRepoHead === fakeTurboSrcReposDB[args.owner + "/" + args.repo].head)

    console.log('pullReqHead')
    console.log(pullReqRepoHead)
    console.log(fakeTurboSrcReposDB[args.owner + "/" + args.repo].head)
    console.log(alreadyHead)

    if (prVoteStatusNow !== 'closed' && !votedAlready && openPullRequestStatus && !alreadyHead) {
      const prVoteStatus = updatePRvoteStatus(args, tokens)
      // Add tokens to vote tally so we can get the new
      // pull request vote status.
      // Vote data to sent over the wire.
      //const prVoteStatus = getPRvoteStatus(args);

      var baseRepoName = args.repo
      var baseRepoOwner = args.owner
      const resGetPR = await getPullRequest(baseRepoOwner,baseRepoName, prID);
      var pullReqRepoHead = await gitHeadUtil(resGetPR.contributor, baseRepoName,resGetPR.forkBranch, 0);
      const baseDir = 'repos/' + args.repo;
      //const pullForkDir = baseDir + '/' + pullReqRepoHead;

      console.log('pullReqRepoHead ' + pullReqRepoHead);

      //console.log('\nvote code:\n' + vote_code)

      ////If pull request doesn't exist, we have to make one to set a vote.
      if (resGetPR !== 404 && pullReqRepoHead !== 404) {
        const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side
        //var pullRequest = pullRequestsDB[pr_id]
        //if (typeof pullRequest === 'undefined') {
        //  newPullRequest(args);
        //  pullRequest = [vote_code]
        //}
        //  // Prevent duplicate votes by same contributor on same pull request
        //for (var i = 0; i < pullRequest.length; i++) {
        //  const vote_codes = pullRequest[i]
        //  if (vote_codes.split("%")[0] === args.contributor_id) {
        //    exists = true
        //  }
        //}
        //if (exists === false) {
        //  pullRequest.push(vote_code)
        //}

        // Push to redis here for newVoteStream
        // key = pr_id, value = vote_code

        // If vote close it out, open it up for other PRs.
        if (prVoteStatus === 'closed') {
          [res,pullReqRepoHead] = await getPRhead(args)

          // Update HEAD to repo.
          fakeTurboSrcReposDB[args.owner + "/" + args.repo].head = pullReqRepoHead

          // Add to history
          pullRequestsVoteCloseHistory.push(prID)

          // Delete pull request from database
          delete fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID]

          // Allow next pull request to be voted on.
          fakeTurboSrcReposDB[args.owner + "/" + args.repo].openPullRequest = ''
        }
      }
    }

    return getPRvoteStatus(args)
     //return JSON.stringify(pullRequestsDB)
  },
  newPullRequest: async (args) => {
    const prVoteStatus = getPRvoteStatus(args)
    const tokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].contributors[args.contributor_id]
    const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side
    pullRequestsDB[args.pr_id] = [vote_code]
    return pullRequestsDB[args.pr_id]
  }
}

module.exports = root