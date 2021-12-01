import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type PullRequest {
    contributor_id: String
    side: Boolean
  }
  type Query {
    getVote(side: Boolean, contributor_id: String): PullRequest
  }
`);
// Maps id to User object
var fakeDatabase = {
  'a': {
    contributor_id: 'a',
    side: true,
  },
  'b': {
    contributor_id: 'b',
    side: false,
  },
};

 const loggingMiddleware = (req, res, next) => {
    console.log('vote:', req.data);
    next();
 }
// The root provides the top-level API endpoints
var root = {
  getVote: (args) => {
    return fakeDatabase[args.contributor_id]
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
