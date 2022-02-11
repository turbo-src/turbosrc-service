const fs = require('fs')
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
//const { createClient } = require('redis');
const superagent = require('superagent');
const { getPRhead } = require('./pullForkUtil');
const { getPullRequest } = require('./gitHubUtil');
const { gitHeadUtil } = require('./gitHeadUtil');
const { update } = require('tar');
const {
  getPRvoteTotals,
  getPRvoteStatus
} = require('./actions')

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
    getPRvoteStatus(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getPRvoteTotals(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    getRepoStatus(repo_id: String): Boolean,
    getAuthorizedContributor(contributor_id: String, repo_id: String): Boolean,
    verifyPullRequest(pr_id: String): String,
  }
`);

// Basically this will be a database service until we put this on ipfs or something.
var pullRequestsVoteCloseHistory = []

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

(async () => {
  var head;
  var owner;
  var repo;
  for (i in repoAccounts) {
    if (repoAccounts[i] !== "default/default") {
      repoPath = repoAccounts[i].split('/')
      owner = repoPath[0]
      repo = repoPath[1]
      // Don't pass forkName because it's the master or main branch.
      head = await gitHeadUtil(owner, repo, '', 0)
      //'pullRequestStatus': {
      //  '$prID': $status,
      //  '$prID': $status,
      //}

      fakeTurboSrcReposDB[repoAccounts[i]] = {
        'head': head,
        'supply': 1_000_000,
        'quorum': 0.50,
        'openPullRequest': '',
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
      //  'contributors': {
      //    'emmanuel': 290_000,
      //    'mary': 290_000,
      //    'joseph': 200_000,
      //    'john': 200_000,
      //    '7db9a': 20_000,
      //  },
      //  'pullRequests': {
      //    'prid':
      //      'totalVotedTokens': $totalVotedTokens,
      //      'votedTokens': {
      //        '$contributorID': {
      //          tokens: $tokens,
      //          side: $side,
      //        }
      //       }
      //    }
      //  }
      //}
    }
  };

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
})();
// The root provides the top-level API endpoints

async function pullAndVoteStatus(database, args) {
  const prID = (args.pr_id).split('_')[1]
  var votedAlready;

  const activePullRequests = database[args.owner + "/" + args.repo].pullRequests
  const numberActivePullRequests = Object.keys(activePullRequests).length

  if (numberActivePullRequests === 0) {
     database[args.owner + "/" + args.repo].openPullRequest = prID
  }

  const openPullRequest = database[args.owner + "/" + args.repo].openPullRequest

  const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]

  // We can only use the function if there asking for about a
  // specific pull request.
  console.log('owner ' + args.owner)
  console.log('repo ' + args.repo)
  console.log('pr_id ' + prID)
  console.log('tokens ' + tokens)

  const prVoteStatusNow = getPRvoteStatus(database, args)
  if (prVoteStatusNow === 'none') {
     votedAlready = false
  } else {
    const votedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens
    votedAlready = Object.keys(votedTokens).includes(args.contributor_id)
    console.log(args.contributor_id + ' voted already: ' + votedAlready)
  }

  const openPullRequestStatus = (openPullRequest === prID || openPullRequest === '');

  console.log('op pr status: ' + openPullRequestStatus)

  var [res, pullReqRepoHead] = await getPRhead(args)
  const alreadyHead = (pullReqRepoHead === database[args.owner + "/" + args.repo].head)

  console.log('pullReqHead')
  console.log(pullReqRepoHead)
  console.log(database[args.owner + "/" + args.repo].head)
  console.log(alreadyHead)

  console.log("s 391")
  console.log((prVoteStatusNow !== 'closed' && !votedAlready && openPullRequestStatus && !alreadyHead))

  const pullAndVoteStatus = (prVoteStatusNow !== 'closed' && !votedAlready && openPullRequestStatus && !alreadyHead)

  return pullAndVoteStatus
  //return {
  //         prVoteStatusNow: prVoteStatusNow,
  //         votedAlready: votedAlready,
  //         openPullRequestStatus: openPullRequestStatus,
  //         alreadyHead: alreadyHead
  //}

}

async function setVote(database, args) {
  const prID = (args.pr_id).split('_')[1]
  const resultPullAndVoteStatus = await pullAndVoteStatus(database, args)

  //const resultVoteStatus = await voteStatus(database, standardArgs)
  //const prVoteStatusNow = resultVoteStatus.prVoteStatusNow
  //const votedAlready = resultVoteStatus.votedAlready
  //const openPullRequestStatus = resultVoteStatus.openPullRequestStatus
  //const alreadyHead = resultVoteStatus.alreadyHead

  const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]

  if (resultPullAndVoteStatus) {
    var pullRequest = pullRequestsDB[args.pr_id]
    if (typeof pullRequest === 'undefined') {
      const resNewPullRequest = newPullRequest(database, args);
      fakeTurboSrcReposDB = resNewPullRequest.db
    }
    const resUpdatePRvoteStatus = updatePRvoteStatus(fakeTurboSrcReposDB,args, tokens)
    fakeTurboSrcReposDB = resUpdatePRvoteStatus.db
    prVoteStatus =resUpdatePRvoteStatus.prVoteStatusUpdated

    console.log('408')
    console.log(prVoteStatus)
    console.log(database)
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
      // If vote close it out, open it up for other PRs.
      if (prVoteStatus === 'closed') {
        [res,pullReqRepoHead] = await getPRhead(args)

        // Update HEAD to repo.
        database[args.owner + "/" + args.repo].head = pullReqRepoHead

        // Add to history
        pullRequestsVoteCloseHistory.push(prID)

        // Delete pull request from database
        delete database[args.owner + "/" + args.repo].pullRequests[prID]

        // Allow next pull request to be voted on.
        database[args.owner + "/" + args.repo].openPullRequest = ''
      }
    }
  }

  console.log('475')

  return {
           db: database,
           prVoteStatus: getPRvoteStatus(database, args)
  }
}

function updatePRvoteStatus(database, standardArgs, tokens) {
  const prID = standardArgs.pr_id.split('_')[1]
  const prVoteStatusNow = getPRvoteStatus(database, standardArgs)
  console.log(database)
  prVoteStatusUpdated = prVoteStatusNow

  if (prVoteStatusNow === 'open') {
    database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens.contributorID = {}
    database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id] = {
      tokens: 0,
      side: 'none'
    }

    console.log('upr 212')
    const totalVotedTokens = database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens

    //Add to vote tally. Creates pull request fields if needed.
    database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens = totalVotedTokens + tokens

    database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id].side = standardArgs.side

    prVoteStatusUpdated = getPRvoteStatus(database, standardArgs)

    database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID]['pullRequestStatus'] = prVoteStatusUpdated

    console.log('upr 228')
  }

  // Maybe should have index increment to know if updated or not
  return {
           db: database,
           prVoteStatusUpdated : prVoteStatusUpdated
  }
}

// Probably unnecessary as setting vote will open pull
// request automatically if non exists, including same
// root 'method' for query.
function newPullRequest(database, args) {
  const prID = args.pr_id.split('_')[1]

  const prVoteStatus = getPRvoteStatus(database, args)
  const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]
  const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side

  pullRequestsDB[args.pr_id] = [vote_code]

  console.log('npr 239')
  database[args.owner + "/" + args.repo].pullRequests[prID] = {}

  database[args.owner + "/" + args.repo].pullRequests[prID].pullRequestStatus = 'open'

  database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens = 0
  database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens = {}
  database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens.contributorID = {}
  database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens[args.contributor_id] = {
    tokens: 0,
    side: 'none'
  }

  console.log('npr 247')

  return {
           prID: pullRequestsDB[args.pr_id],
           db: database
  }
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
    var status = getPRvoteStatus(fakeTurboSrcReposDB, args)
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
    return getPRvoteTotals(fakeTurboSrcReposDB, args)
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
    const resultSetVote = await setVote(fakeTurboSrcReposDB, args)

    fakeTurboSrcReposDB = resultSetVote.db

    return resultSetVote.prVoteStatus
  },
  newPullRequest: async (args) => {
    const prVoteStatus = getPRvoteStatus(fakeTurboSrcReposDB, args)
    const tokens = fakeTurboSrcReposDB[args.owner + "/" + args.repo].contributors[args.contributor_id]
    const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side
    pullRequestsDB[args.pr_id] = [vote_code]

    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens = 0
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens = {}
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens.contributorID = {}
    fakeTurboSrcReposDB[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id] = {
      tokens: 0,
      side: 'none'
    }

    return pullRequestsDB[args.pr_id]
  }
}