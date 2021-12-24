const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const { createClient } = require('redis');
const { pullForkUtil } = require('./pullForkUtil');
const { getPullRequest } = require('./gitHubUtil');

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

var schema = buildSchema(`
  type PullRequest {
    vote_code: [String]
  }
  type Query {
    newPullRequest(pr_id: String, contributor_id: String, side: String): PullRequest,
    getVote(pr_id: String, contributor_id: String): String,
    getVoteAll(pr_id: String): PullRequest,
    getVoteEverything: String,
    setVote(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
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
var fakeTurboSrcReposDB = {
  //repo_id
  'default': {
    'supply': 1_000_000,
    'head':'default:default',
    'contributors': {
      'default':  1_000_0000
    },
  },
  'turbo-src/extension': {
    'supply': 1_000_000,
    'head':'',
    'contributors': {
      'emmanuel': 290_000,
      'mary': 290_000,
      'joseph': 200_000,
      'john': 200_000,
      '7db9a': 20_000,
    }
  },
  'vim/vim': {
    'supply': 1_000_000,
    'head':'',
    'contributors': {
      'emmanuel': 290_000,
      'mary': 290_000,
      'joseph': 200_000,
      'john': 200_000,
      '7db9a': 20_000,
    }
  },
  'NixOS/nixpkgs': {
    'supply': 1_000_000,
    'head':'',
    'contributors': {
      'emmanuel': 290_000,
      'mary': 290_000,
      'joseph': 200_000,
      'john': 200_000,
      '7db9a': 20_000,
    }
  },
}

const fakeAuthorizedContributors = {
  'default': ['default'],
  'turbo-src/extension': ['emmanuel','mary', 'joseph', 'john'],
  'turbo-src/graphql_express_server': ['emmanuel','mary', 'joseph', 'john'],
  '7db9a/dir_contract': ['7db9a','emmanuel','mary', 'joseph', 'john'],
  'vim/vim': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john'],
  'NixOS/nix': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john'],
  'NixOS/nixpkgs': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john']
}

// The object representing authorized repos and contributors.
var pullRequestsDB = {
   'default': ['vote_code']
};

 const loggingMiddleware = (req, res, next) => {
    console.log('vote:', req.data);
    next();
 }
// The root provides the top-level API endpoints

function newPullRequest(args) {
  const vote_code = args.contributor_id + "%" + args.side
  pullRequestsDB[args.pr_id] = [vote_code]
  return pullRequestsDB[args.pr_id]
};

var root = {
  //getVote: (args) => {
  //  return pullRequestsDB[args.contributor_id]
  //},
  verifyPullRequest: (arg) => {
    // Check if it's in our database
    // If not, fetch it.

    // redis.get(sha256)

    //return status
    //return fakeTurboSrcReposDB.includes(arg.repo_id)
  },
  getRepoStatus: (arg) => {
    return Object.keys(fakeTurboSrcReposDB).includes(arg.repo_id)
  },
  getAuthorizedContributor: (args) => {
    console.log(args.repo_id)
    console.log(args.contributor_id)
    const contributors = fakeTurboSrcReposDB[args.repo_id].contributors;
    const contributor_exists = Object.keys(contributors).includes(args.contributor_id)
    return contributor_exists
  },
  getVoteAll: (pr_id) => {
    return pullRequestsDB[pr_id]
  },
  getVoteEverything: () => {
    return JSON.stringify(pullRequestsDB)
  },
  setVote: (args) => {
    (async () => {
      const pr_id = args.pr_id
      var exists = false

      var vote_code = "undefined";

      // See if pull request is verified or needs to be.
      // verfify(pr_id)

      // Need:
      // owner
      // repo
      var forkSha256;
      var oid;
      let res1 = await client.get('github_' + pr_id);
      console.log('null ' + res1)
      if (res1 === null) {
         console.log('owner ' + args.owner)
         console.log('repo ' + args.repo)
         let res = await getPullRequest(args.owner, args.repo, pr_id.split('_')[1])
         console.log('contributor :' + res.contributor)
         console.log('repo :' + res.repo)
         forkSha256 = await pullForkUtil(
           args.owner,
           args.repo + '_' + pr_id,
           `https://github.com/${res.contributor}/${args.repo}`,
           res.forkBranch
         )
         // Saving by github issue id, then later by oid.
         await client.set(
           'github_' + pr_id,
           `${res.oid} ${forkSha256}`
         );

         // Hypothetically there could be an oid (sha-1) collision,
         // so we save the sha256 for dealing with those corner cases.
         await client.set(
           'oid_' + res.oid,
           `${forkSha256}`
         );
      } else {
        // use this to add into pullRequestDB later.
        const resArray = res1.split(' ')
        oid = resArray[0]
        forkSha256 = resArray[1]
      }

      ////If pull request doesn't exist, we have to make one to set a vote.
      var pullRequest = pullRequestsDB[pr_id]
      if (typeof pullRequest === 'undefined') {
        newPullRequest(args);
        vote_code = args.contributor_id + "%" + args.side
        pullRequest = [vote_code]
      }
        // Prevent duplicate votes by same contributor on same pull request
      for (var i = 0; i < pullRequest.length; i++) {
        const vote_codes = pullRequest[i]
        if (vote_codes.split("%")[0] === args.contributor_id) {
          exists = true
        }
      }
      if (exists === false) {
        vote_code = args.contributor_id + "%" + args.side
        pullRequest.push(vote_code)
      }

      // Push to redis here for newVoteStream
      // key = pr_id, value = vote_code
      if (vote_code !== "undefined") {
        console.log('send to redis)')
        await client.lPush("vote", `{${pr_id}: ${vote_code}}`);
        //Unlocks newVotes schema loop.
        await client.lPush("newvoteschemalock", "1");
      }
      //await client.publish(pr_id, vote_code);
    })();

    return JSON.stringify(pullRequestsDB)
  },
  newPullRequest: (args) => {
    const vote_code = args.contributor_id + "%" + args.side
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