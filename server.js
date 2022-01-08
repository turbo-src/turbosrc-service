const fs = require('fs')
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const { createClient } = require('redis');
const superagent = require('superagent');
const { pullForkUtil } = require('./pullForkUtil');
const { getPullRequest } = require('./gitHubUtil');
const { gitHeadUtil } = require('../git_server/gitHeadUtil');
const { update } = require('tar');

// pr_id is the issue_id, which are the same for now.
// issue_id !== pr_uid in the future.
// The pr_uid will be the OID of the HEAD from the pull requesters linked repository.
// We may actually choose to calculate the sha256 of the repo at said HEAD to eliminate all doubt of collisions in OID (sha) and to be able to verify that the pull requester and the merger have the absolute identical versions.

// side is refers to the said of the vote, yes or no.
// The vote_code is $(contributor_id)%$(side). In the future it will be an object that includes the contributors signature for the blockchain action (e.g. smart contract vote).

(async () => {

const client = createClient({
  url: 'redis://@172.17.0.2:6379'
  //host: '172.17.0.2',
  //port: '6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

    //getPRforkStatus(owner: String, repo: String, pr_id: String, contributor_id: String): String,
    //pullFork(owner: String, repo: String, pr_id: String, contributor_id: String),
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
    getPRvoteStatus(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getRepoStatus(repo_id: String): Boolean,
    getAuthorizedContributor(contributor_id: String, repo_id: String): Boolean,
    verifyPullRequest(pr_id: String): String,
  }
`);

// From extension/src/utils/commonUtil.js
//getUsernameWithReponameFromGithubURL()
// returns  { user: user, repo: repo }
// user is the owner of the repo, not contributors.

// The object representing pullRequests for a specific repository.

var fakeTurboSrcReposDB = {};
//const head = await gitHeadUtil('turbo-src', 'extension', 0)
const repoAccounts = [
  'default/default',
  'turbo-src/extension',
  'turbo-src/graphql_express_server',
  '7db9a/dir-contract',
  'vim/vim',
  'NixOS/nix',
  'NixOS/nixpkgs',
]
//const contributors = ['emmanuel','mary', 'joseph', 'john', '7db9a']

var head;
var owner;
var repo;
for (i in repoAccounts) {
  if (repoAccounts[i] !== "default/default") {
    repoPath = repoAccounts[i].split('/')
    owner = repoPath[0]
    repo = repoPath[1]
    head = await gitHeadUtil(owner, repo, 0)
    //'pullRequestStatus': {
    //  '$prID': $status,
    //  '$prID': $status,
    //}

    fakeTurboSrcReposDB[repoAccounts[i]] = {
      'head': head,
      'supply': 1_000_000,
      'quorum': 0.50,
      'contributors': {
        'mary': 500_001,
        '7db9a': 499_999,
      },
      'pullRequests': {
      }
    }

    //fakeTurboSrcReposDB[repoAccounts[i]] = {
    //  'head': head,
    //  'supply': 1_000_000,
    //  'quorum': 0.50,
    //  'votedTokens': 0,
    //  'contributors': {
    //    'emmanuel': 290_000,
    //    'mary': 290_000,
    //    'joseph': 200_000,
    //    'john': 200_000,
    //    '7db9a': 20_000,
    //  },
    //  'pullRequestStatus': {
    //  }
    //}
  }
};

const fakeAuthorizedContributors = {
  'default': ['default'],
  'turbo-src/extension': ['emmanuel','mary', 'joseph', 'john'],
  'turbo-src/graphql_express_server': ['emmanuel','mary', 'joseph', 'john'],
  '7db9a/dir-contract': ['7db9a','emmanuel','mary', 'joseph', 'john'],
  'vim/vim': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john'],
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

// Also a root 'methods' in graphql query, by the same name

function getPRvoteStatus(args) {
    const prID = args.pr_id.split('_')[1]

    const supply = fakeTurboSrcReposDB[args.owner + "/" + args.repo].supply
    const quorum = fakeTurboSrcReposDB[args.owner + "/" + args.repo].quorum

    const prFields = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID]

    if (prFields) {
      const votedTokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].pullRequests[prID].votedTokens
      const percentVoted = votedTokens/supply
      if (percentVoted >= quorum) {
        return 'closed'
      } else {
        return 'open'
      }
    } else {
      return 'none'
    }
}

function updatePRvoteStatus(standardArgs, tokensVoted) {
  const prID = standardArgs.pr_id.split('_')[1]
  const prVoteStatusNow = getPRvoteStatus(standardArgs)
  if (prVoteStatusNow === 'none') {
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID] = {}
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].pullRequestStatus = 'open'
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens = 0
  }

  const votedTokens = fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens

  //Add to vote tally. Creates pull request fields if needed.
  fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens = votedTokens + tokensVoted

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
  getPRforkStatus: async (args) => {
    var res;
    const prID = (args.pr_id).split('_')[1]
    // User should do this instead and pass it in request so we don't overuse our github api.
    console.log('owner ' + args.owner)
    console.log('repo ' + args.repo)
    console.log('pr_id ' + prID)
    var baseRepoName = args.repo
    var baseRepoOwner = args.owner
    var resGetPR = await getPullRequest(args.owner, baseRepoOwner, prID)
    var pullReqRepoHead = await gitHeadUtil(resGetPR.contributor, baseRepoName, 0)
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

      //let res1 = await client.get('github_' + pr_id);
      //const redisForkSha256 = await client.git('oid_' + baseRepoHead)

      // User should do this instead and pass it in request so we don't overuse our github api.
      const tokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].contributors[args.contributor_id]

      const prVoteStatusNow = getPRvoteStatus(args)

      // We can only use the function if there asking for about a
      // specific pull request.
      console.log('owner ' + args.owner)
      console.log('repo ' + args.repo)
      console.log('pr_id ' + prID)
      console.log('tokens ' + tokens)

      updatePRvoteStatus(args, tokens)
      if (prVoteStatusNow !== 'closed') {
        // Add tokens to vote tally so we can get the new
        // pull request vote status.
        // Vote data to sent over the wire.
        const prVoteStatus = getPRvoteStatus(args);
        const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side

        var baseRepoName = args.repo
        var baseRepoOwner = args.owner
        const resGetPR = await getPullRequest(args.owner, baseRepoOwner, prID);
        var pullReqRepoHead = await gitHeadUtil(resGetPR.contributor, baseRepoName, 0);
        const baseDir = 'repos/' + args.repo;
        //const pullForkDir = baseDir + '/' + pullReqRepoHead;

        console.log('pullReqRepoHead ' + pullReqRepoHead);

        //console.log('\nvote code:\n' + vote_code)

        ////If pull request doesn't exist, we have to make one to set a vote.
        if (resGetPR !== 404 && pullReqRepoHead !== 404) {
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
          if (vote_code !== "undefined") {
            console.log('send to redis)')
            var newvoteschemalock = await client.lRange("newvoteschemalock", 0, -1)
            while (newvoteschemalock.length > 0) {
               newvoteschemalock = await client.lRange("newvoteschemalock", 0, -1)
            }
            await client.lPush("vote", `{${args.pr_id}: ${vote_code}}`);
            //Unlocks newVotes schema loop.
            await client.lPush("newvoteschemalock", "1");
          }
        }
      }

      //await client.publish(pr_id, vote_code);
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
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
})();