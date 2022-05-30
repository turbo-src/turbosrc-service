const fs = require('fs')
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
//const { createClient } = require('redis');
const superagent = require('superagent');
const { getPRhead } = require('./pullForkUtil');
const { gitHeadUtil } = require('./gitHeadUtil');
const { update } = require('tar');
const {
  getPRvoteTotals,
  getPRvote,
  getPRvoteStatus,
  newPullRequest,
  setVote,
  createRepo,
  getActivePullRequestsCount,
  getRepoStatus,
  checkContributor,
  checkMergePullRequestHistory,
  checkRejectPullRequestHistory
} = require('./actions')
const {
       getPullRequest,
       createPullRequest,
       closePullRequest,
       mergePullRequest
      } = require('./gitHubUtil');

// pr_id is the issue_id, which are the same for now.
// issue_id !== pr_uid in the future.
// The pr_uid will be the OID of the HEAD from the pull requesters linked repository.
// We may actually choose to calculate the sha256 of the repo at said HEAD to eliminate all doubt of collisions in OID (sha) and to be able to verify that the pull requester and the merger have the absolute identical versions.

// side is refers to the said of the vote, yes or no.
// The vote_code is $(contributor_id)%$(side). In the future it will be an object that includes the contributors signature for the blockchain action (e.g. smart contract vote).

var schema = buildSchema(`
  type PullRequest {
    vote_code: [String]
  }
  type Query {
    pullFork(owner: String, repo: String, pr_id: String, contributor_id: String): String,
    getPRforkStatus(owner: String, repo: String, pr_id: String, contributor_id: String): String,
    getVote(pr_id: String, contributor_id: String): String,
    getVoteAll(pr_id: String): PullRequest,
    getVoteEverything: String,
    setVote(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    createRepo(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    newPullRequest(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getPRvoteStatus(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getPRvoteTotals(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getPRvoteYesTotals(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getPRvoteNoTotals(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getRepoStatus(repo_id: String): Boolean,
    getAuthorizedContributor(contributor_id: String, repo_id: String): Boolean,
    verifyPullRequest(pr_id: String): String,
    createPullRequest(owner: String, repo: String, fork_branch: String, pr_id: String, title: String): String,
    closePullRequest(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    mergePullRequest(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
  }
`);

// Basically this will be a database service until we put this on ipfs or something.
var pullRequestsVoteCloseHistory = []
var pullRequestsVoteMergeHistory = []

// From extension/src/utils/commonUtil.js
//getUsernameWithReponameFromGithubURL()
// returns  { user: user, repo: repo }
// user is the owner of the repo, not contributors.

// The object representing pullRequests for a specific repository.

var fakeTurboSrcReposDB = {};
//const head = await gitHeadUtil('turbo-src', 'extension', 0)
const repoAccounts = [
  'default/default',
]
//const contributors = ['emmanuel','mary', 'joseph', 'john', '7db9a']

const fakeAuthorizedContributors = {
  'default': ['default'],
  'turbo-src/extension': ['emmanuel','mary', 'joseph', 'john'],
  'turbo-src/graphql_express_server': ['emmanuel','mary', 'joseph', 'john'],
  '7db9a/dir-contract': ['7db9a','emmanuel','mary', 'joseph', 'john'],
  'vim/vim': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john', 'am', 'jc', 'pc', 'mb', 'np', 'nn', 'jp', 'ts', 'af', 'aj', 'ds', 'ri' ],
  'NixOS/nix': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john'],
  'NixOS/nixpkgs': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john']
}

// The object representing authorized repos and contributors.
var pullRequestsDB = {
   'default/default': ['vote_code']
};

 const loggingMiddleware = (req, res, next) => {
    console.log('vote:', req.data);
    next();
 }

// The root provides the top-level API endpoints

// Probably unnecessary as setting vote will open pull
// request automatically if non exists, including same
// root 'method' for query.
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
  getRepoStatus: async (args) => {
    const status = getRepoStatus(fakeTurboSrcReposDB, args)

    return status
  },
  getAuthorizedContributor: async (args) => {
    console.log(args.repo_id)
    console.log(args.contributor_id)
    const contributor_exists = checkContributor(fakeTurboSrcReposDB, args)
    return contributor_exists
  },
  getVoteAll: async (pr_id) => {
    return pullRequestsDB[pr_id]
  },
  getVoteEverything: async () => {
    return JSON.stringify(pullRequestsDB)
  },
  getPRvoteStatus: async (args) => {
    var status = getPRvoteStatus(fakeTurboSrcReposDB, args)
    if (status === 'open' || status === 'none' ) {
      const prID = (args.pr_id).split('_')[1]
      const closeRes = checkRejectPullRequestHistory(pullRequestsVoteCloseHistory, args)
      if (closeRes) {
        status = 'closed'
      }

      const mergeRes = checkMergePullRequestHistory(pullRequestsVoteMergeHistory, args)

      if (mergeRes) {
        status = 'merge'
      }
    }

    return status
  },
  getPRpercentVotedQuorum: async (args) => {
    const voteTotals = getPRvoteTotals(fakeTurboSrcReposDB, args)
    return voteTotals.percentVotedQuorum
  },
  getPRvoteYesTotals: async (args) => {
    const voteTotals = getPRvoteTotals(fakeTurboSrcReposDB, args)
    return voteTotals.totalVotedYesTokens
    //return voteTotals.percentVotedQuorum
  },
  getPRvoteNoTotals: async (args) => {
    const voteTotals = getPRvoteTotals(fakeTurboSrcReposDB, args)
    return voteTotals.totalVotedNoTokens
    //return voteTotals.percentVotedQuorum
  },
  getPRvoteTotals: async (args) => {
    const voteTotals = getPRvoteTotals(fakeTurboSrcReposDB, args)
    //return voteTotals.totalVotedTokens
    return voteTotals.percentVotedQuorum
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
    // Check user votes. If voted, don't set vote.
    debugger
    const votedTokens = getPRvote(fakeTurboSrcReposDB, args);
    if ( votedTokens > 0) {
      return "duplicate"
    } else if (typeof votedTokens === 'undefined') {

      // If vote not open, open it.
      const voteStatus = await getPRvoteStatus(fakeTurboSrcReposDB, args);
      if (voteStatus === 'none') {

       const numberActivePullRequests = getActivePullRequestsCount(fakeTurboSrcReposDB, args)

       //Fix: shouldn't make state changes in status check.

       // Only allow to open the pull request for vote
       // if there is no other active vote.
       if (numberActivePullRequests === 0) {
         const resNewPullRequest = await newPullRequest(fakeTurboSrcReposDB, pullRequestsDB, args)

         fakeTurboSrcReposDB = resNewPullRequest.db
       pullRequestsDB = resNewPullRequest.pullRequestsDB
       }
      }

      const resultSetVote = await setVote(fakeTurboSrcReposDB, pullRequestsDB, pullRequestsVoteCloseHistory, pullRequestsVoteMergeHistory, args)

      fakeTurboSrcReposDB = resultSetVote.db
      return resultSetVote.prVoteStatus
    }

  },
  newPullRequest: async (args) => {
    const resNewPullRequest = await newPullRequest(fakeTurboSrcReposDB, pullRequestsDB, args)

    fakeTurboSrcReposDB = resNewPullRequest.db
    pullRequestsDB = resNewPullRequest.pullRequestsDB

    return pullRequestsDB[args.pr_id]
  },
  createRepo: async (args) => {
    debugger
    const resCreateRepo = await createRepo(fakeTurboSrcReposDB, pullRequestsDB, args)
    fakeTurboSrcReposDB = resCreateRepo.db
    pullRequestsDB = resCreateRepo.pullRequestsDB

    return pullRequestsDB[args.pr_id]
  },
  //GH Server endpoints below
  createPullRequest: async (args) => {
    await createPullRequest(args.owner, args.repo, args.fork_branch, args.pr_id.split('_')[1], args.title)
  },
  closePullRequest: async (args) => {
    await closePullRequest(args.owner, args.repo, args.pr_id.split('_')[1])
  },
  mergePullRequest: async (args) => {
    await mergePullRequest(args.owner, args.repo, args.pr_id.split('_')[1])
  },
  //End of GH server endpoints.
}

var app = express();
//app.use(loggingMiddleware);
app.use(cors());
app.use(function (req, res, next) {
    let originalSend = res.send;
    res.send = function (data) {
        console.log(data + "\n");
        originalSend.apply(res, Array.from(arguments));
    }
    next();
});
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
var way = false;
//if (way === true) {
//     console.log("true");
//     return true;
//   } else {
//     console.log("false");
//     return false;
//}
app.listen(8080);
console.log('Running a GraphQL API server at localhost:4000/graphql');