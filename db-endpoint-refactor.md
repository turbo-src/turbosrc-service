# Refactor database endpoint

Below is an example of how to refactor.

addToTotalVotedYesTokens
postAddToTotalVotedYesTokensDB

fs.writeFileSync('testing/special/turbo-src-database-add-voted-yes.json', JSON.stringify(database, null, 2) , 'utf-8');

fs.writeFileSync('testing/special/turbo-src-test-database-add-voted-yes.json', JSON.stringify(database, null, 2) , 'utf-8');

## testdbserver.js

### 1. Modify values for database inputs.

Any extra inputs beyond database and args, must be changed to args.arg. 'database' and other extra argument must be removed from function signature.

```
-  setContributorVotedTokens: function (database, args, tokens, side) {
+  setContributorVotedTokens: async function (args) {
    const prID = (args.pr_id).split('_')[1]

    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens[args.contributor_id] = {
-     tokens: tokens,
-     side: side
+     tokens: args.tokens,
+     side: args.side
    }

-   return database
+   fs.writeFileSync('testing/special/turbo-src-test-database-set-contributor-voted-tokens.json', JSON.stringify(database, null, 2) , 'utf-8');
   },

```

### 2. Add to schema.


```
+    setContributorVotedTokens(owner: String, repo: String, pr_id: String, contributor_id: String, side: String, tokens: String): String,

```

## graphQLrequests.js

### 1. Add graphql request.

```
+  postSetContributorVotedTokensTestDB: async (owner, repo, issue_id, contributor_id, side, tokens) => {
+   superagent
+     .post('http://localhost:8081/graphql')
+     .send(
+       //{ query: '{ name: 'Manny', species: 'cat' }' }
+       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
+       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
+       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
+       //{ query: `{ getVoteEverything }` }
+       { query: `{ setContributorVotedTokens(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }` }
+       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
+     ) // sends a JSON post body
+     .set('accept', 'json')
+     .end((err, res) => {
+       // Calling the end function will send the request
+     });
+  },
```

## actions.js

### 1. add `postSetContributorVotedTokensTestDB` request to imports

```
         postSetTSrepoHeadTestDB,
         postSetQuorumTestDB,
         postNewPullRequestTestDB,
+        postSetContributorVotedTokensTestDB,
       } = require('./graphQLrequests')
```

### 2. add request next to original

Be sure to modify the inputs with respect to testdbserver.js

```
+      await postSetContributorVotedTokensTestDB(
+        args.owner,
+        args.repo,
+        args.pr_id,
+        args.contributor_id,
+        "none",
+        0
+      )
+
+      //To be deprecated for above.
       database = setContributorVotedTokens(database, args, 0, "none")
```

Repeat wherever a to-be-deprecated function to be found.

## state.js

### 1. Add file write statement to setContributorVotedTokens.

```
+   fs.writeFileSync('testing/special/turbo-src-database-set-contributor-voted-tokens.json', JSON.stringify(database, null, 2) , 'utf-8');
+
    return database
   },
```

Make sure to only add the statement, don't delete anything.

## Notes

state.js -> action.js

addToTotalVotedYesTokens
addToTotalVotedNoTokens
addToTotalVotedTokens