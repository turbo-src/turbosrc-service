import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
// vote_code = contributor_id + "%" + side
// side = 0 || 1
var schema = buildSchema(`
  type PullRequest {
    vote_code: String
  }
  type Query {
    newPullRequest(pr_id: String, contributor_id: String, side: Int!): PullRequest,
    getVote(pr_id: String, contributor_id: String): String,
    getVoteAll(pr_id: String): PullRequest,
    setVote(pr_id: String, contributor_id: String, side: Int!): PullRequest
  }
`);
// Maps id to User object
var fakeDatabase = {}
var fakeDatabase = {
  'default': {
    vote_code: 'default',
  }
};

 const loggingMiddleware = (req, res, next) => {
    console.log('vote:', req.data);
    next();
 }
// The root provides the top-level API endpoints
var root = {
  //getVote: (args) => {
  //  return fakeDatabase[args.contributor_id]
  //},
  getVoteAll: (pr_id) => {
    return fakeDatabase[pr_id]
  },
  setVote: (args) => {
    const vote_code = args.contributor_id + "%" + args.side
    fakeDatabase[args.pr_id].push(vote_code)
    return fakeDatabase[args.pr_id]
  },
  newPullRequest: (args) => {
    const vote_code = args.contributor_id + "%" + args.side
    fakeDatabase[args.pr_id] = {
      vote_code: vote_code
    }
    return fakeDatabase[args.pr_id]
  }
}

var app = express();
//app.use(loggingMiddleware);
app.use(function (req, res, next) {
    let originalSend = res.send;
    res.send = function (data) {
        console.log(data);
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
