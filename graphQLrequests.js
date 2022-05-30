const { Parser } = require('graphql/language/parser');
const superagent = require('superagent');

var root = {
  postCreateRepoTestDB: async (owner, repo, issue_id, contributor_id, side) => {
   superagent
     .post('http://localhost:8081/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ createRepo(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postCreateTokenSupplyTestDB: async (owner, repo, issue_id, contributor_id, side, tokens) => {
   superagent
     .post('http://localhost:8081/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ createTokenSupply(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postSetTSrepoHeadTestDB: async (owner, repo, issue_id, contributor_id, side, head) => {
   superagent
     .post('http://localhost:8081/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ setTSrepoHead(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}", head: "${head}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postSetQuorumTestDB: async (owner, repo, issue_id, contributor_id, side, quorum) => {
   superagent
     .post('http://localhost:8081/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ setQuorum(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}", quorum: "${quorum}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postNewPullRequestTestDB: async (owner, repo, issue_id, contributor_id, side, vote_status) => {
   superagent
     .post('http://localhost:8081/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ newPullRequest(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}", vote_status: "${vote_status}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postCreateRepo: async (owner, repo, issue_id, contributor_id, side) => {
   superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ createRepo(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postNewPullRequest: async (owner, repo, issue_id, contributor_id, side) => {
   superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ newPullRequest(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postSetVote: async (owner, repo, issue_id, contributor_id, side) => {
   superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ setVote(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  get_repo_status: async (repo_id) => {
    return await superagent
    .post('http://localhost:4000/graphql')
    .send(
    { query: `{ getRepoStatus(repo_id: "${repo_id}") }`}
    ).set('accept', 'json')
    //.end((err, res) => {
    //  //console.log(repo_id)
    //  //console.log('hey')
    //  //console.log('res: ' + res['body']['data']['getRepoStatus'])
    //  //const text= res['text'];
    //  //console.log(text);
    //  //isRepoTurboSrcToken = res;
    //  // Calling the end function will send the request
    //  return res
    //})
  },
  get_authorized_contributor: async (contributor_id, repo_id) => {
     return await superagent
     .post('http://localhost:4000/graphql')
     .send(
     { query: `{ getAuthorizedContributor(contributor_id: "${contributor_id}", repo_id: "${repo_id}") }`}
     ).set('accept', 'json')
  },
  postPullFork: async (owner, repo, issue_id, contributor_id) => {
   return await superagent
     .post('http://localhost:4001/graphql')
     .send(
       { query: `{ getPRfork(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}") }` }
     ) // sends a JSON post body
     .set('accept', 'json')
  },
  postGetPRforkStatus: async (owner, repo, issue_id, contributor_id) => {
   const res = await superagent
     .post('http://localhost:4000/graphql')
     .send(
       { query: `{ getPRforkStatus(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}") }` }
     ) // sends a JSON post body
     .set('accept', 'json')
   //const resJSON = JSON.parseFromString(res.text)
   //console.log(resJSON)
   //return resJSON.data.getPRforkStatus
   const json = JSON.parse(res.text)
   return json.data.getPRforkStatus
  },
  postGetPRvoteStatus: async (owner, repo, issue_id, contributor_id, side) => {
   const res = await superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ getPRvoteStatus(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     //.end((err, res) => {
       // Calling the end function will send the request
     //});
   const json = JSON.parse(res.text)
   console.log(json)
   return json.data.getPRvoteStatus
  },
  postGetPRpercentVotedQuorum: async (owner, repo, issue_id, contributor_id, side) => {
   const res = await superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ getPRvoteTotals(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     //.end((err, res) => {
       // Calling the end function will send the request
     //});
   const json = JSON.parse(res.text)
   console.log(json)
   return json.data.percentVotedQuorum
  },
  postGetPRvoteTotals: async (owner, repo, issue_id, contributor_id, side) => {
   const res = await superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ getPRvoteTotals(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     //.end((err, res) => {
       // Calling the end function will send the request
     //});
   const json = JSON.parse(res.text)
   console.log(json)
   return json.data.getPRvoteTotals
  },
  postGetPRvoteYesTotals: async (owner, repo, issue_id, contributor_id, side) => {
   const res = await superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ getPRvoteYesTotals(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     //.end((err, res) => {
       // Calling the end function will send the request
     //});
   const json = JSON.parse(res.text)
   //console.log(json)
   return json.data.getPRvoteYesTotals
  },
  postGetPRvoteNoTotals: async (owner, repo, issue_id, contributor_id, side) => {
   const res = await superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ getPRvoteNoTotals(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     //.end((err, res) => {
       // Calling the end function will send the request
     //});
   const json = JSON.parse(res.text)
   //console.log(json)
   return json.data.getPRvoteNoTotals
  },
  postClosePullRequest: async (owner, repo, issue_id, contributor_id, side) => {
   superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ closePullRequest(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postMergePullRequest: async (owner, repo, issue_id, contributor_id, side) => {
   superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ mergePullRequest(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postCreatePullRequest: async (owner, repo, fork_branch, issue_id, title) => {
   superagent
     .post('http://localhost:4000/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ createPullRequest(owner: "${owner}", repo: "${repo}", fork_branch: "${fork_branch}", pr_id: "${issue_id}", title: "${title}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postSetContributorVotedTokensTestDB: async (owner, repo, issue_id, contributor_id, side, tokens) => {
   superagent
     .post('http://localhost:8081/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ setContributorVotedTokens(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
  postAddToTotalVotedYesTokensDB: async (owner, repo, issue_id, contributor_id, side, tokens) => {
   superagent
     .post('http://localhost:8081/graphql')
     .send(
       //{ query: '{ name: 'Manny', species: 'cat' }' }
       //{ query: '{ newPullRequest(pr_id: "first", contributorId: "1", side: 1) { vote_code } }' }
       //{ query: '{ getVote(pr_id: "default", contributorId: 1) {side} }' }
       //{ query: '{ getVoteAll(pr_id: "default") { vote_code } }' }
       //{ query: `{ getVoteEverything }` }
       { query: `{ addToTotalVotedYesTokens(owner: "${owner}", repo: "${repo}", pr_id: "${issue_id}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }` }
       //{ query: '{ setVote(pr_id: "default" contributorId: "2", side: 1 ) { vote_code }' }
     ) // sends a JSON post body
     .set('accept', 'json')
     .end((err, res) => {
       // Calling the end function will send the request
     });
  },
}

module.exports = root