const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');

// Construct a schema, using GraphQL schema language
// vote_code = contributor_id + "%" + side
// side = 0 || 1
var schema = buildSchema(`
  type PullRequest {
    vote_code: [String]
  }
  type Query {
    newPullRequest(pr_id: String, contributor_id: String, side: Int!): PullRequest,
    getVote(pr_id: String, contributor_id: String): String,
    getVoteAll(pr_id: String): PullRequest,
    getVoteEverything: String,
    setVote(pr_id: String, contributor_id: String, side: Int!): String
  }
`);
// Maps id to User object
var fakeDatabase = {}
var fakeDatabase = {
  'default': ['vote_code']
};

 const loggingMiddleware = (req, res, next) => {
    console.log('vote:', req.data);
    next();
 }
// The root provides the top-level API endpoints

function newPullRequest(args) {
  const vote_code = args.contributor_id + "%" + args.side
  fakeDatabase[args.pr_id] = [vote_code]
  return fakeDatabase[args.pr_id]
};

var root = {
  //getVote: (args) => {
  //  return fakeDatabase[args.contributor_id]
  //},
  getVoteAll: (pr_id) => {
    return fakeDatabase[pr_id]
  },
  getVoteEverything: () => {
    return JSON.stringify(fakeDatabase)
  },
  setVote: (args) => {
    const pr_id = args.pr_id
    //If pull request doesn't exist, we have to make one to set a vote.
    if (typeof fakeDatabase[pr_id] === 'undefined') {
      newPullRequest(args);
      const vote_code = args.contributor_id + "%" + args.side
      fakeDatabase[args.pr_id] = [vote_code]
    } else {
      const vote_code = args.contributor_id + "%" + args.side
      fakeDatabase[pr_id].push(vote_code)
    }
    return JSON.stringify(fakeDatabase)
  },
  newPullRequest: (args) => {
    const vote_code = args.contributor_id + "%" + args.side
    fakeDatabase[args.pr_id] = [vote_code]
    return fakeDatabase[args.pr_id]
  }
}

var app = express();
//app.use(loggingMiddleware);
app.use(cors());
app.use(function (req, res, next) {
    let originalSend = res.send;
    res.send = function (data) {
        console.log(data);
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
