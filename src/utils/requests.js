const { Parser } = require('graphql/language/parser');
const superagent = require('superagent');
require('dotenv').config();



const {
  getServiceEndpoint, getContributorAddress
} = require('./config.js');

let url;
let turboSrcID;

(async () => {
  url = await getServiceEndpoint('turbosrc');
  turboSrcID = await getContributorAddress();
})();

console.log('requests to: ', turboSrcID);

//const port =
//  process.env.NODE_ENV === "fly"
//    ? "https://turbosrc-service.fly.dev"
//    : "http://localhost:4000";

var root = {
  postCreateRepoTestDB: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post('http://localhost:8081/graphql')
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ createRepo(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postCreateTokenSupplyTestDB: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side,
    tokens
  ) => {
    superagent
      .post('http://localhost:8081/graphql')
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ createTokenSupply(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postSetTSrepoHeadTestDB: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side,
    head
  ) => {
    superagent
      .post('http://localhost:8081/graphql')
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ setTSrepoHead(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", head: "${head}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postSetQuorumTestDB: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side,
    quorum
  ) => {
    superagent
      .post('http://localhost:8081/graphql')
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ setQuorum(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", quorum: "${quorum}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postNewPullRequestTestDB: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side,
    vote_status
  ) => {
    superagent
      .post('http://localhost:8081/graphql')
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ newPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", vote_status: "${vote_status}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature,
    token
  ) => {
    const res = await superagent
      .post(url)
      .send({
        query: `
          {
            createUser(owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") {
              status
              message
              info {
                contributor_id
                contributor_name
              }
            }
          }
        `,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createUser;
  },
  postGetContributorName: async (owner, repo, defaultHash, contributor_id) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getContributorName(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    console.log('gqlr 123');
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getContributorName;
  },
  postGetContributorID: async (owner, repo, defaultHash, contributor_name) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getContributorID(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_name: "${contributor_name}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    console.log('gqlr 123');
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getContributorID;
  },
  postGetContributorSignature: async (
    owner,
    repo,
    defaultHash,
    contributor_id
  ) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getContributorSignature(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    console.log('gqlr 145');
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getContributorSignature;
  },
  postCreateRepo: async (owner, repo, defaultHash, contributor_id, side, token) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ createRepo(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", token: "${token}") {status, repoName, repoID, repoSignature, message} }`
      })
      .set('accept', 'json');

    const json = JSON.parse(res.text);
    return json.data.createRepo;
  },
  getUser: async (contributor_id) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ getUser(turboSrcID: "${turboSrcID}", contributor_id: "${contributor_id}") {contributor_name, contributor_id, contributor_signature, token}}`
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getUser;
  },
  findOrCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature,
    token) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ findOrCreateUser(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") {contributor_name, contributor_id, contributor_signature, token}}`
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.findOrCreateUser;
  },
  postGetVotePowerAmount: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side,
    token
  ) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getVotePowerAmount(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", token: "${token}") { status, amount } }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getVotePowerAmount;
  },
  postTransferTokens: async (owner, repo, from, to, amount, token) => {
    superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ transferTokens(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", from: "${from}", to: "${to}", amount: ${amount}, token: "${token}" ) {status, repo, to, from, id, network, createdAt, amount} }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postNewPullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ newPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postSetVote: async (owner, repo, defaultHash, childDefaultHash, mergeable, contributor_id, side, token) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ setVote(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", mergeable: ${mergeable}, contributor_id: "${contributor_id}", side: "${side}", token: "${token}" ) }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //   .end((err, res) => {
    //      Calling the end function will send the request
    //   });
    const json = JSON.parse(res.text);
    return json.data.setVote;
  },
  getRepoStatus: async (repo_id) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ getRepoStatus(turboSrcID: "${turboSrcID}", repo_id: "${repo_id}" ) { status, exists } }`
      })
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getRepoStatus;
  },
  get_authorized_contributor: async (contributor_id, repo_id) => {
    return await superagent
      .post(url)
      .send({
        query: `{ getAuthorizedContributor(turboSrcID: "${turboSrcID}", contributor_id: "${contributor_id}", repo_id: "${repo_id}") }`
      })
      .set('accept', 'json');
  },
  postPullFork: async (owner, repo, defaultHash, contributor_id) => {
    return await superagent
      .post('http://localhost:4001/graphql')
      .send({
        query: `{ getPRfork(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
      }) // sends a JSON post body
      .set('accept', 'json');
  },
  postGetPRforkStatus: async (owner, repo, defaultHash, contributor_id) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ getPRforkStatus(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
      }) // sends a JSON post body
      .set('accept', 'json');
    //const resJSON = JSON.parseFromString(res.text)
    //console.log(resJSON)
    //return resJSON.data.getPRforkStatus
    const json = JSON.parse(res.text);
    return json.data.getPRforkStatus;
  },
  postGetPullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ getPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") { status, state, repo_id, fork_branch, defaultHash, childDefaultHash, mergeableCodeHost } }`
      })
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getPullRequest;
  },
  getGitHubPullRequest: async (owner, repo, defaultHash, contributor_id) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ getGitHubPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") { status, mergeable, mergeCommitSha, state, baseBranch } }`
      })
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getGitHubPullRequest;
  },
  postGetPRpercentVotedQuorum: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side
  ) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.percentVotedQuorum;
  },
  postGetPRvoteTotals: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getPRvoteTotals;
  },
  postGetPRvoteYesTotals: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side
  ) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteYesTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    //console.log(json)
    return json.data.getPRvoteYesTotals;
  },
  postGetPRvoteNoTotals: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side
  ) => {
    const res = await superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteNoTotals(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    //console.log(json)
    return json.data.getPRvoteNoTotals;
  },
  postClosePullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ closePullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postMergePullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ mergePullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postCreateTsrcPullRequest: async (
    owner,
    repo,
    defaultHash,
    childDefaultHash,
    head,
    branchDefaultHash,
    remoteURL,
    baseBranch,
    fork_branch,
    title
  ) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ createTsrcPullRequest(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", head: "${head}", branchDefaultHash: "${branchDefaultHash}", remoteURL: "${remoteURL}", baseBranch: "${baseBranch}"fork_branch: "${fork_branch}", title: "${title}") }`
      })
      .set('accept', 'json');

    const json = JSON.parse(res.text);
    return json.data.createTsrcPullRequest;
  },
  postFork: async (owner, repo, org) => {
    superagent
      .post(url)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        { query: `{ fork(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", org: "${org}") }` }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postSetContributorVotedTokensTestDB: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side,
    tokens
  ) => {
    superagent
      .post('http://localhost:8081/graphql')
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ setContributorVotedTokens(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postAddToTotalVotedYesTokensDB: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side,
    tokens
  ) => {
    superagent
      .post('http://localhost:8081/graphql')
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ addToTotalVotedYesTokens(turboSrcID: "${turboSrcID}", owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }`
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set('accept', 'json')
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  findOrCreateNameSpaceRepo: async (
    repoName,
    repoID) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ findOrCreateNameSpaceRepo(repoName: "${repoName}", repoID: "${repoID}") {status, repoName, repoID, repoSignature, message}}`
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.findOrCreateNameSpaceRepo;
  },
  getNameSpaceRepo: async (
    repoNameOrID) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ getNameSpaceRepo(repoNameOrID: "${repoNameOrID}") {status, repoName, repoID, repoSignature, message}}`
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getNameSpaceRepo;
  },
  postGetRepoData: async (repo_id, contributor_id) => {
    const res = await superagent
      .post(url)
      .send({
        query: `{ getRepoData(repo_id: "${repo_id}", contributor_id: "${contributor_id}")
      {
        status,
        repo_id,
        owner,
        contributor_id,
        head,
        inSession,
        quorum,
        contributor {
          contributor_id,
          contributor,
          votePower,
        },
      pullRequests {
        state,
        repo_id,
        issue_id,
        title,
        forkBranch,
        baseBranch,
        defaultHash,
        childDefaultHash,
        head,
        defaultHash,
        remoteURL
      voteData {
        contributor {
        contributor_id,
        voted,
        side,
        votePower,
        createdAt,
        },
      voteTotals {
        yesPercent,
        noPercent,
        totalVotes,
        totalYesVotes,
        totalNoVotes,
      },
      votes {
        contributor_id,
        side,
        votePower,
        createdAt
      }
    }
  }
}
}`
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getRepoData;
  },
  postGetVotes: async (repo, defaultHash, contributor_id) => {
    const res = await superagent
      .post(url)
      .send({
        query: `
        { getVotes(repo: "${repo}", defaultHash: "${defaultHash}", contributor_id:"${contributor_id}") {
            status, repo_id, title, head, remoteURL, baseBranch, forkBranch, childDefaultHash, defaultHash, mergeable, state,
            voteData {
              contributor {
                voted, side, votePower, createdAt, contributor_id
              },
              voteTotals {
                totalVotes, totalYesVotes, totalNoVotes, votesToQuorum, votesToMerge, votesToClose, totalVotePercent, yesPercent, noPercent, quorum
              },
              votes { contributor_id, side, votePower, createdAt }
              },
            }
}
      `
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getVotes;
  }
};

module.exports = root;