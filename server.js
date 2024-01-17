const fs = require('fs');
const fsPromises = require('fs').promises;
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
//const { createClient } = require('redis');
const superagent = require('superagent');
const { getPRhead } = require('./src/utils/pullForkUtil');
const { gitHeadUtil } = require('./src/utils/gitHeadUtil');
const { update } = require('tar');
const {
  createTsrcPullRequest,
  transferTokens,
  getPRvoteTotals,
  getPRvoteYesTotals,
  getPRvoteNoTotals,
  getPRvote,
  getPullRequest,
  newPullRequest,
  setVote,
  createUser,
  getContributorID,
  getContributorName,
  getContributorSignature,
  createRepo,
  getActivePullRequestsCount,
  getRepoStatus,
  getAuthorizedContributor,
  checkMergePullRequestHistory,
  checkRejectPullRequestHistory,
  getVotePowerAmount,
  getUser,
  findOrCreateUser,
  getVotes,
  getRepoData,
  findOrCreateNameSpaceRepo,
  getNameSpaceRepo,
  getTurboSrcIDfromInstance,
  checkGitHubAccessTokenPermissions,
  verify,
  createGitHubPullRequest,
  getGitHubPullRequest,
  closeGitHubPullRequest,
  mergeGitHubPullRequest,
} = require('./src/lib/actions')

// defaultHash is the defaultHash, which are the same for now.
// defaultHash !== pr_uid in the future.
// The pr_uid will be the OID of the HEAD from the pull requesters linked repository.
// We may actually choose to calculate the sha256 of the repo at said HEAD to eliminate all doubt of collisions in OID (sha) and to be able to verify that the pull requester and the merger have the absolute identical versions.

// side is refers to the said of the vote, yes or no.
// The vote_code is $(contributor_id)%$(side). In the future it will be an object that includes the contributors signature for the blockchain action (e.g. smart contract vote).
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

var schema = buildSchema(`
  type CreateUserResponse {
    status: String!
    message: String!
    info: UserInfo
  }

  type UserInfo {
    contributor_id: String!
    contributor_name: String!
  }

  type PullRequest {
    status: Int!
    state: String!
    repo_id: String!
    fork_branch: String!
    defaultHash: String!
    childDefaultHash: String!
    head: String!
    branchDefaultHash:String!
    remoteURL: String!
    baseBranch: String!
    mergeableCodeHost: Boolean!
  }

  type ghPullRequest {
    status: Int!
    mergeable: Boolean!
    mergeCommitSha: String!
    state: String!
    baseBranch: String!
  }

  type RepoStatus {
    status: Int!
    exists: Boolean!
  }

  type ContributorTokenAmount {
    status: Int!
    amount: Int!
  }

  type User {
    contributor_name: String!
    contributor_id: String!
    contributor_signature: String!
    token: String!
  }

  type Permissions {
    status: Int!
    message: String!
    public_repo_scopes: Boolean!
    push_permissions: Boolean!
  }

  type Vote {
    contributor_id: String!
    side: String!
    votePower: Int!
    createdAt: String!
  }

  type RepoContributor {
    contributor_id: String!
    contributor: Boolean!
    votePower: Int!
}

  type ContributorVoteData {
    voted: Boolean!
    side: String!
    votePower: Int!
    createdAt: String!
    contributor_id: String!
  }

  type VoteTotals {
    totalVotes: Int!
    totalYesVotes: Int!
    totalNoVotes: Int!
    votesToQuorum: Int!
    votesToMerge: Int!
    votesToClose: Int!
    totalVotePercent: Float!
    yesPercent: Float!
    noPercent: Float!
    quorum: Float!
  }

  type VoteData {
    contributor: ContributorVoteData!
    voteTotals: VoteTotals!
    votes: [Vote]!
  }

  type GetVotes {
    status: Int!
    repo_id: String!
    issue_id: String!
    title: String!
    head: String!
    remoteURL: String!
    baseBranch: String!
    forkBranch: String!
    childDefaultHash: String!
    defaultHash: String!
    mergeable: Boolean!
    state: String!
    voteData: VoteData!
  }

  type RepoData {
    status: Int!
    repo_id: String!
    owner: String!
    contributor_id: String!
    head: String!
    inSession: Boolean!
    quorum: Float!
    contributor: RepoContributor!
    pullRequests: [GetVotes]!
  }

  type TransferReceipt {
    status: Int!
    repo: String!
    to: String!
    from: String!
    amount: Int!
    createdAt: String!
    network: String!
    id: String!
  }

  type NameSpaceRepo {
  status: Int!,
  message: String!,
  repoName: String!,
  repoID: String!,
  repoSignature: String!,
}

  type Query {
    createTsrcPullRequest(turboSrcID: String, owner: String, repo: String, defaultHash: String, childDefaultHash: String, head: String, branchDefaultHash: String, remoteURL: String, baseBranch: String, fork_branch: String, title: String, issue_id: String): String,
    getVotePowerAmount(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, token: String): ContributorTokenAmount,
    createUser(turboSrcID: String, contributor_id: String, contributor_name: String, contributor_signature: String, token: String): CreateUserResponse,
    getUser(turboSrcID: String, contributor_id: String): User,
    findOrCreateUser(turboSrcID: String, owner: String, repo: String, contributor_id: String, contributor_name: String, contributor_signature: String, token: String): User,
    checkGithubTokenPermissions(turboSrcID: String, owner: String, repo: String, contributor_name: String, token: String): Permissions,
    getContributorName(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String): String,
    getContributorID(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_name: String): String,
    getContributorSignature(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String): String,
    transferTokens(turboSrcID: String, owner: String, repo: String, from: String, to: String, amount: Int, token: String): TransferReceipt,
    pullFork(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String): String,
    getVote(turboSrcID: String, defaultHash: String, contributor_id: String): String,
    getVoteAll(turboSrcID: String, defaultHash: String): ghPullRequest,
    getVoteEverything: String,
    setVote(turboSrcID: String, owner: String, repo: String, defaultHash: String, childDefaultHash: String, mergeable: Boolean, contributor_id: String, side: String, token: String): String,
    createRepo(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String, side: String, token: String): NameSpaceRepo,
    newPullRequest(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String, side: String): String,
    getPullRequest(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String, side: String): PullRequest,
    getGitHubPullRequest(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String): ghPullRequest,
    getVotes(turboSrcID: String, repo: String, defaultHash: String, contributor_id: String): GetVotes,
    getPRvoteTotals(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String, side: String): Float,
    getPRvoteYesTotals(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String, side: String): Float,
    getPRvoteNoTotals(turboSrcID: String, owner: String, repo: String, defaultHash: String, contributor_id: String, side: String): Float,
    getRepoStatus(turboSrcID: String, repo_id: String): RepoStatus,
    getAuthorizedContributor(turboSrcID: String, contributor_id: String, repo_id: String): Boolean,
    verifyPullRequest(turboSrcID: String, defaultHash: String): String,
    createPullRequest(turboSrcID: String, owner: String, repo: String, fork_branch: String, defaultHash: String, title: String, token: String): String,
    closePullRequest(turboSrcID: String, owner: String, repo: String, defaultHash: String, token: String): String,
    mergePullRequest(turboSrcID: String, owner: String, repo: String, defaultHash: String, token: String): String,
    fork(turboSrcID: String, owner: String, repo: String, org: String, name: String, defaultBranchOnly: Boolean, token: String): String,
    getRepoData(turboSrcID: String, repo_id: String, contributor_id: String): RepoData,
    findOrCreateNameSpaceRepo(status: Int, message: String, repoName: String, repoID: String, repoSignature: String): NameSpaceRepo,
    getNameSpaceRepo(turboSrcID: String, repoNameOrID: String): NameSpaceRepo,
    getTurboSrcIDfromInstance: String!,
  }
`);

// Basically this will be a database service until we put this on ipfs or something.
var pullRequestsVoteCloseHistory = [];
var pullRequestsVoteMergeHistory = [];

// From extension/src/utils/commonUtil.js
//getUsernameWithReponameFromGithubURL()
// returns  { user: user, repo: repo }
// user is the owner of the repo, not contributors.

// The object representing pullRequests for a specific repository.

//userSignature's keys are not the namespaced names but the account addresses.
var nameSpaceDB = {
  // contributor_id: name
  'contributors': [
  ]
};

function getContributorsByContributorID (contributors, id) {
  return contributors.filter(
    function (contributors){ return contributors.id == id; }
  );
}

function getContributorsByName (contributors, name) {
  return contributors.filter(
    function (contributors){ return contributors.name == name; }
  );
}

var fakeTurboSrcReposDB = {};
//const head = await gitHeadUtil('turbo-src', 'extension', 0)
const repoAccounts = [
  'default/default'
];
//const contributors = ['emmanuel','mary', 'joseph', 'john', '7db9a']

const fakeAuthorizedContributors = {
  'default': ['default'],
  'turbo-src/extension': ['emmanuel','mary', 'joseph', 'john'],
  'turbo-src/graphql_express_server': ['emmanuel','mary', 'joseph', 'john'],
  '7db9a/dir-contract': ['7db9a','emmanuel','mary', 'joseph', 'john'],
  'vim/vim': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john', 'am', 'jc', 'pc', 'mb', 'np', 'nn', 'jp', 'ts', 'af', 'aj', 'ds', 'ri' ],
  'NixOS/nix': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john'],
  'NixOS/nixpkgs': ['7db9a', 'Yoshgunn', 'emmanuel','mary', 'joseph', 'john']
};

// The object representing authorized repos and contributors.
var pullRequestsDB = {
  'default/default': ['vote_code']
};

const loggingMiddleware = (req, res, next) => {
  console.log('vote:', req.data);
  next();
};

// The root provides the top-level API endpoints

// Probably unnecessary as setting vote will open pull
// request automatically if non exists, including same
// root 'method' for query.
var root = {
  //getVote: (args) => {
  //  return pullRequestsDB[args.contributor_id]
  //},
  createTsrcPullRequest: async (args) => {
    const res = await createTsrcPullRequest(args);
    return res;
  },
  createUser: async (args) => {
    const res = await createUser(args);
    return res;
  },
  getUser: async (args) => {
    const res = await getUser(args);
    return res;
  },
  findOrCreateUser: async (args) => {
    const res = await findOrCreateUser(args);
    return res;
  },
  getContributorName: async (args) => {
    const res = getContributorName(args);
    return res;
  },
  getContributorID: async (args) => {
    const res =  await getContributorID(args);
    return res;
  },
  getContributorSignature: async (args) => {
    const res = await getContributorSignature(args);
    return res;
  },
  checkGithubTokenPermissions: async (args) => {
    const permissions = await checkGitHubAccessTokenPermissions(args.owner, args.repo, args.contributor_name, args.token)
    return permissions
  },
  getVotePowerAmount: async (args) => {
    const contributorTokenAmount = await getVotePowerAmount(fakeTurboSrcReposDB, args);

    return contributorTokenAmount;
  },
  transferTokens: async (args) => {
    const verified = await verify(args.from, args.token);
    console.log('');
    console.log('235 server');
    console.log('');

    if (verified === true) {
    //const from = nameSpaceDB['users'][args.from]
    //const to = nameSpaceDB['users'][args.to]
    //if (from === args.from && to === args.to) {
      console.log('to: ' + args.to);
      // If not found, error is "There was an error: TypeError: Cannot read properties of null (reading 'contributor_name')"
      const contributorName = await getContributorName(
        {contributor_id: args.to}
      );
      if (contributorName !== null) {
        console.log('contributor name: ' + contributorName);
        const resTransferTokens = await transferTokens(fakeTurboSrcReposDB, pullRequestsDB, args);
        fakeTurboSrcReposDB = resTransferTokens.db;
        return resTransferTokens;
      }
    }
  },
  verifyPullRequest: async (arg) => {
    // Check if it's in our database
    // If not, fetch it.

    // redis.get(sha256)

    //return status
    //return fakeTurboSrcReposDB.includes(arg.repo_id)
  },
  getRepoStatus: async (args) => {
    const res = await getRepoStatus(args);

    return res;
  },
  getAuthorizedContributor: async (args) => {
    const res = await getAuthorizedContributor(args);

    return res;
  },
  getVoteAll: async (defaultHash) => {
    return pullRequestsDB[defaultHash];
  },
  getVoteEverything: async () => {
    return JSON.stringify(pullRequestsDB);
  },
  getPullRequest: async (args) => {
    const status = await getPullRequest(args);

    return status;
  },
  getGitHubPullRequest: async (args) => {
    const contributor_id = args.contributor_id;
    const defaultHash = (args.defaultHash);
    const issueID = (args.defaultHash).split('_')[1]; // Need this for check gitHubPullRequest.
    console.log('before try catch');
    if (contributor_id === undefined || contributor_id === 'undefined' || contributor_id === '') {
      debugger;

    } else if (defaultHash === undefined || defaultHash === 'undefined' || defaultHash === '') {
      debugger;
    }
    try {
      const gitHubPullRequest = await getGitHubPullRequest(args.owner, args.repo, Number(issueID), contributor_id);

      console.log('try catch');
      mergeable = gitHubPullRequest.mergeable;
      const baseBranch = gitHubPullRequest.base.ref;
      const forkBranch = gitHubPullRequest.head.ref;
      const head =  gitHubPullRequest.head.sha;
      const remoteURL = gitHubPullRequest.head.repo.git_url;
      const title = gitHubPullRequest.title;
      console.log('baseBranch ', baseBranch);
      console.log('title ', title);
      if (mergeable === null) {
        mergeable = false;
      }

      var mergeCommitSha;
      const state = gitHubPullRequest.state;
      if (gitHubPullRequest.merge_commit_sha === null) {
        mergeCommitSha = '';
      } else {
        mergeCommitSha = gitHubPullRequest.merge_commit_sha;
      }
      if (mergeable === null) {
        mergeable = false;
      }

      return {
        status: 200,
        mergeable: mergeable,
        mergeCommitSha: mergeCommitSha,
        state: state,
        baseBranch: baseBranch
      };
    } catch (error) {
      return {
        status: 500,
        mergeable: false,
        mergeCommitSha: '',
        state: '',
        baseBranch: ''
      };
    }
  },
  getPRpercentVotedQuorum: async (args) => {
    const voteTotals = getPRvoteTotals(fakeTurboSrcReposDB, args);
    return voteTotals.percentVotedQuorum;
  },
  getVotes: async (args) => {
    return await getVotes(
      args.repo,
      args.defaultHash,
      args.contributor_id
    );
  },
  getRepoData: async (args) => {
    return await getRepoData(
      args.repo_id,
      args.contributor_id
    );
  },
  getPRvoteYesTotals: async (args) => {
    const voteYesTotals = await getPRvoteYesTotals(args);

    return voteYesTotals;
  },
  getPRvoteNoTotals: async (args) => {
    const voteNoTotals = await getPRvoteNoTotals(args);

    return voteNoTotals;
  },
  getPRvoteTotals: async (args) => {
    const voteTotals = await getPRvoteTotals(args);

    return voteTotals;
  },
  pullFork: async (args) => {
    superagent
      .post('http://localhost:4001/graphql')
      .send(
        { query: `{ getPRfork(owner: "${args.owner}", repo: "${args.repo}", defaultHash: "${args.defaultHash}", contributor_id: "${args.contributor_id}") }` }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
    return 'something';
  },
  setVote: async (args) => {
    const verified = await verify(args.contributor_id, args.token);

    if (verified === true) {
      const resultSetVote = await setVote(args);

      return resultSetVote;
    }
  },
  newPullRequest: async (args) => {
    const resNewPullRequest = await newPullRequest(fakeTurboSrcReposDB, pullRequestsDB, args);

    fakeTurboSrcReposDB = resNewPullRequest.db;
    pullRequestsDB = resNewPullRequest.pullRequestsDB;

    return pullRequestsDB[args.defaultHash];
  },
  createRepo: async (args) => {
    // name space server
    const verified = await verify(args.contributor_id, args.token);

    if (verified === true) {
      return await createRepo(args);
    }
  },
  findOrCreateNameSpaceRepo: async (args) => {
    const res = await findOrCreateNameSpaceRepo(
      args
    );
    return res;
  },
  getNameSpaceRepo: async (args) => {
    const res = await getNameSpaceRepo(
      args
    );
    return res;
  },
  //GH Server endpoints below
  createPullRequest: async (args) => {
    await createGitHubPullRequest(args.owner, args.repo, args.title, args.fork_branch, args.defaultHash, args.token)
  },
  closePullRequest: async (args) => {
    await closeGitHubPullRequest(args.owner, args.repo, args.pull, args.token)
  },
  mergePullRequest: async (args) => {
    await mergeGitHubPullRequest(args.owner, args.repo, args.pull, args.token)
  },
  fork: async (args) => {
    await createGitHubRepoFork(args.owner, args.repo, args.organization, args.name, args.defaultBranchOnly, args.token)
  },

  getTurboSrcIDfromInstance: async () => {
    turboSrcID = await getTurboSrcIDfromInstance();
    return turboSrcID;
  }

  //End of GH server endpoints.
};

var app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);

//app.use(loggingMiddleware);
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
app.get('/', (req, res) => {
  res.status(200).send();
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});
