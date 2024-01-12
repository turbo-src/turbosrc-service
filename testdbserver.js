const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const fs = require('fs');
const fsPromises = require('fs').promises;

var database = {};
// Basically this will be a database service until we put this on ipfs or something.
var pullRequestsVoteCloseHistory = [];
var pullRequestsVoteMergeHistory = [];

// The object representing authorized repos and contributors.
var pullRequestsDB = {
  'default/default': ['vote_code']
};

var schema = buildSchema(`
  type PullRequest {
    vote_code: [String]
  }
  type Query {
    getPullRequestFromHistory(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String): String,
    createRepo(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String): String,
    createTokenSupply(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, tokens: String): String,
    setTSrepoHead(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, head: String): String,
    setQuorum(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, quorum: String): String,
    newPullRequest(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, vote_status: String): String,
    setContributorVotedTokens(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, tokens: String): String,
    addToTotalVotedYesTokens(owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, tokens: String): String,
  }
`);

async function getGithubUser () {
  const data = await fsPromises.readFile('/usr/src/app/.config.json')
    .catch((err) => console.error('Failed to read file', err));

  let json = JSON.parse(data);
  let user = json.github.user;
  if (user === undefined) {
    throw new Error('Failed to load Github user ' + user);

  } else {
    console.log('Successfully read Github ' + user);
  }

  return user;

}

var root = {
  createRepo: async (args) => {
    const user = await getGithubUser();
    database[args.owner + '/' + args.repo] = {
      //'head': head,//'c20e46a4e3efcd408ef132872238144ea34f7ae5',
      'tokenSupply': 1_000_000,
      'openPullRequest': '',
      'contributors': {
        'mary': 500_001,
        'am': 15_000,
        'jc': 10_000,
        'pc': 75_000,
        'mb': 75_000,
        'np': 5_000,
        'nn': 100_000,
        'jp': 50_000,
        'ts': 50_000,
        'af': 10_000,
        'ds': 75_000,
        'ri': 1_000
      },
      'pullRequests': {
      }
    };

    database[args.owner + '/' + args.repo].contributors[user] = 33_999;

    database[args.owner + '/' + args.repo].quorum = 0.50;

    // For testing.
    fs.writeFileSync('testing/special/turbo-src-test-database-create-repo.json', JSON.stringify(database, null, 2) , 'utf-8');
  },
  createTokenSupply: function (args) {
    database[args.owner + '/' + args.repo].tokenSupply = Number(args.tokens);

    // For testing.
    fs.writeFileSync('testing/special/turbo-src-test-database-create-token-supply.json', JSON.stringify(database, null, 2) , 'utf-8');
  },
  setQuorum: function (args) {
    database[args.owner + '/' + args.repo].quorum = Number(args.quorum);

    fs.writeFileSync('testing/special/turbo-src-test-database-set-quorum.json', JSON.stringify(database, null, 2) , 'utf-8');
  },
  newPullRequest: function (args) {
    const defaultHash = args.defaultHash;

    const tokens = database[args.owner + '/' + args.repo].contributors[args.contributor_id];
    const vote_code = args.vote_status + '%' + args.repo + '%' + args.contributor_id + '%' + tokens + '%' + args.side;

    pullRequestsDB[args.defaultHash] = [vote_code];

    database[args.owner + '/' + args.repo].pullRequests[defaultHash] = {};

    database[args.owner + '/' + args.repo].pullRequests[defaultHash].pullRequestStatus = 'open';

    database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedTokens = 0;
    database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedYesTokens = 0;
    database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedNoTokens = 0;
    database[args.owner + '/' + args.repo].pullRequests[defaultHash].votedTokens = {};

    fs.writeFileSync('testing/special/turbo-src-test-database-new-pull-request.json', JSON.stringify(database, null, 2) , 'utf-8');
  },
  getContributorTokens: function (database, args) {
    tokens = database[args.owner + '/' + args.repo].contributors[args.contributor_id];

    return tokens;
  },
  setContributorVotedTokens: async function (args) {
    const defaultHash = (args.defaultHash);

    database[args.owner + '/' + args.repo].pullRequests[defaultHash].votedTokens[args.contributor_id] = {
      tokens: Number(args.tokens),
      side: args.side
    };

    fs.writeFileSync('testing/special/turbo-src-test-database-set-contributor-voted-tokens.json', JSON.stringify(database, null, 2) , 'utf-8');
  },
  setVoteSide: function (database, args) {
    const defaultHash = (args.defaultHash);

    database[args.owner + '/' + args.repo].pullRequests[defaultHash].votedTokens[args.contributor_id].side = args.side;

    return database;
  },
  // Soon to be tdefaultHash. Right now it's the HEAD of the
  // pull request fork on Github.
  setTSrepoHead: function (args) {
    database[args.owner + '/' + args.repo].head = args.head;

    fs.writeFileSync('testing/special/turbo-src-test-database-set-ts-repo-head.json', JSON.stringify(database, null, 2) , 'utf-8');

    return database;
  },
  setPullRequestStatus: function (database, args, status) {
    const defaultHash = (args.defaultHash);

    database[args.owner + '/' + args.repo].pullRequests[defaultHash]['pullRequestStatus'] = status;

    return database;
  },
  getTSrepoHead: function (database, args) {
    const head = database[args.owner + '/' + args.repo].head;

    return head;
  },
  getOpenPullRequest: function (database, args) {
    const openPullRequest = database[args.owner + '/' + args.repo].openPullRequest;

    return openPullRequest;
  },
  setOpenPullRequest: function (database, args, openPullRequest) {
    database[args.owner + '/' + args.repo].openPullRequest = openPullRequest;

    return database;
  },
  getTSpullRequest: function (database, args) {
    const defaultHash = (args.defaultHash);
    const pullRequest = database[args.owner + '/' + args.repo].pullRequests[defaultHash];

    return pullRequest;
  },
  getAllTSpullRequests: function (database, args) {
    const allTSpullRequests = database[args.owner + '/' + args.repo].pullRequests;

    return allTSpullRequests;
  },
  deleteTSpullRequest: function (database, args) {
    const defaultHash = (args.defaultHash);

    delete database[args.owner + '/' + args.repo].pullRequests[defaultHash];

    return database;
  },
  getContributorVotedTokens: function (database, args) {
    const defaultHash = (args.defaultHash);

    const votedTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].votedTokens[args.contributor_id];

    return votedTokens;
  },
  getAllVotedTokens: function (database, args) {
    const defaultHash = (args.defaultHash);

    const allVotedTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].votedTokens;

    return allVotedTokens;
  },
  getTokenSupply: function (database, args) {
    const supply = database[args.owner + '/' + args.repo].tokenSupply;

    return supply;
  },
  getQuorum: function (database, args) {
    const quorum = database[args.owner + '/' + args.repo].quorum;

    return quorum;
  },
  getTotalVotedTokens: function (database, args) {
    const defaultHash = (args.defaultHash);

    const totalVotedTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedTokens;

    return totalVotedTokens;
  },
  getTotalVotedYesTokens: function (database, args) {
    const defaultHash = (args.defaultHash);

    const totalVotedYesTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedYesTokens;

    return totalVotedYesTokens;
  },
  getPullRequestFromHistory: function (pullRequestsDB, args) {
    var pullRequest = pullRequestsDB[args.defaultHash];

    return pullRequest;
  },
  getTotalVotedNoTokens: function (database, args) {
    const defaultHash = (args.defaultHash);

    const totalVotedNoTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedNoTokens;

    return totalVotedNoTokens;
  },
  getRepoStatus: function (database, args) {
    return Object.keys(database).includes(args.repo_id);
  },
  checkContributor: function (database, args) {
    const contributors = database[args.repo_id].contributors;
    const contributor_exists = Object.keys(contributors).includes(args.contributor_id);

    return contributor_exists;
  },
  addToTotalVotedTokens: function (database, args, tokens) {
    const defaultHash = (args.defaultHash);

    const totalVotedTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedTokens;

    database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedTokens = totalVotedTokens + tokens;

    return database;
  },
  addToTotalVotedYesTokens: function (args) {
    const defaultHash = (args.defaultHash);

    const totalVotedYesTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedYesTokens;

    database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedYesTokens = totalVotedYesTokens + Number(args.tokens);

    fs.writeFileSync('testing/special/turbo-src-test-database-add-voted-yes.json', JSON.stringify(database, null, 2) , 'utf-8');
  },
  addToTotalVotedNoTokens: function (database, args, tokens) {
    const defaultHash = (args.defaultHash);

    const totalVotedNoTokens = database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedNoTokens;

    database[args.owner + '/' + args.repo].pullRequests[defaultHash].totalVotedNoTokens = totalVotedNoTokens + tokens;

    return database;
  },
  addToMergePullRequestHistory: function (pullRequestVoteMergeHistory, args) {
    const defaultHash = (args.defaultHash);

    pullRequestVoteMergeHistory.push(defaultHash);

    return pullRequestVoteMergeHistory;
  },
  addToRejectPullRequestHistory: function (pullRequestVoteCloseHistory, args) {
    const defaultHash = (args.defaultHash);

    pullRequestVoteCloseHistory.push(defaultHash);

    return pullRequestVoteCloseHistory;
  },
  checkMergePullRequestHistory: function (pullRequestVoteMergeHistory, args) {
    const defaultHash = (args.defaultHash);

    return pullRequestVoteMergeHistory.includes(defaultHash);
  },
  checkRejectPullRequestHistory: function (pullRequestVoteCloseHistory, args) {
    const defaultHash = (args.defaultHash);

    return pullRequestVoteCloseHistory.includes(defaultHash);
  }
};

var app = express();
//app.use(loggingMiddleware);
app.use(cors());
app.use(function (req, res, next) {
  let originalSend = res.send;
  res.send = function (data) {
    console.log(data + '\n');
    originalSend.apply(res, Array.from(arguments));
  };
  next();
});
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
var way = false;
//if (way === true) {
//     console.log("true");
//     return true;
//   } else {
//     console.log("false");
//     return false;
//}
app.listen(8081);
console.log('Running a GraphQL API server at container\'s localhost:8081/graphql');