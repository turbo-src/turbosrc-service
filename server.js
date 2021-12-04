const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

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
    newPullRequest(pr_id: String, contributor_id: String, side: String): PullRequest,
    getVote(pr_id: String, contributor_id: String): String,
    getVoteAll(pr_id: String): PullRequest,
    getVoteEverything: String,
    setVote(pr_id: String, contributor_id: String, side: String): String
  }
`);

// The object representing pullRequests for a specific repository.
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
  getVoteAll: (pr_id) => {
    return pullRequestsDB[pr_id]
  },
  getVoteEverything: () => {
    return JSON.stringify(pullRequestsDB)
  },
  setVote: (args) => {
    const pr_id = args.pr_id
    var exists = false

    //If pull request doesn't exist, we have to make one to set a vote.
    var pullRequest = pullRequestsDB[pr_id]
    if (typeof pullRequest === 'undefined') {
      newPullRequest(args);
      const vote_code = args.contributor_id + "%" + args.side
      pullRequest = [vote_code]
    }
      // Prevent duplicate votes by same contributor on same pull request
    for (var i = 0; i < pullRequest.length; i++) {
      var vote_codes = pullRequest[i]
      if (vote_codes.split("%")[0] === args.contributor_id) {
        exists = true
      }
    }
    if (exists === false) {
      const vote_code = args.contributor_id + "%" + args.side
      pullRequest.push(vote_code)
    }

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
        //console.log(res)
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
