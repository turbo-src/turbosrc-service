const fs = require('fs')
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
//const { createClient } = require('redis');
const superagent = require('superagent');
const {
       getPullRequest,
       closePullRequest,
       mergePullRequest
      } = require('./gitHubUtil');

var schema = buildSchema(`
  type Query {
    closePullRequest(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
    mergePullRequest(owner: String, repo: String, pr_id: String, contributor_id: String, side: String): String,
  }
`);

var fakeTurboSrcReposDB = {};

 const loggingMiddleware = (req, res, next) => {
    console.log('vote:', req.data);
    next();
 }

// root 'method' for query.
// voting service calls this server to change github
var root = {
  //
  closePullRequest: async (args) => {
    await closePullRequest(args.owner, args.repo, args.pr_id.split('_')[1])
  },
  mergePullRequest: async (args) => {
    await mergePullRequest(args.owner, args.repo, args.pr_id.split('_')[1])
  },
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
console.log('Running a GraphQL API server at localhost:4002/graphql');