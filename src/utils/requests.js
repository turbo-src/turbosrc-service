const { Parser } = require("graphql/language/parser");
const superagent = require("superagent");
require("dotenv").config();

const port =
  process.env.NODE_ENV === "fly"
    ? "https://turbosrc-service.fly.dev"
    : "http://localhost:4000";

var root = {
  postCreateRepoTestDB: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post("http://localhost:8081/graphql")
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ createRepo(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post("http://localhost:8081/graphql")
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ createTokenSupply(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post("http://localhost:8081/graphql")
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ setTSrepoHead(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", head: "${head}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post("http://localhost:8081/graphql")
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ setQuorum(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", quorum: "${quorum}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post("http://localhost:8081/graphql")
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ newPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", vote_status: "${vote_status}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post(`${port}/graphql`)
      .send({
        query: `{ createUser(owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createUser;
  },
  postGetContributorName: async (owner, repo, defaultHash, contributor_id) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getContributorName(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    console.log("gqlr 123");
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getContributorName;
  },
  postGetContributorID: async (owner, repo, defaultHash, contributor_name) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getContributorID(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_name: "${contributor_name}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    console.log("gqlr 123");
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
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getContributorSignature(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    console.log("gqlr 145");
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getContributorSignature;
  },
  postCreateRepo: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ createRepo(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createRepo;
  },
  getUser: async (contributor_id) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getUser(contributor_id: "${contributor_id}") {contributor_name, contributor_id, contributor_signature, token}}`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.getUser;
  },
  postGetContributorTokenAmount: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side
  ) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getContributorTokenAmount(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") { status, amount } }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.getContributorTokenAmount;
  },
  postTransferTokens: async (owner, repo, from, to, amount) => {
    superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ transferTokens(owner: "${owner}", repo: "${repo}", from: "${from}", to: "${to}", amount: ${amount}) }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postNewPullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ newPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postSetVote: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
         query: `{ setVote(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", mergeable: ${mergeable}, contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
    //   .end((err, res) => {
    //      Calling the end function will send the request
    //   });
    const json = JSON.parse(res.text);
    return json.data.setVote;
  },
  getRepoStatus: async (repo_id) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getRepoStatus(repo_id: "${repo_id}" ) { status, exists } }`
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getRepoStatus;
  },
  get_authorized_contributor: async (contributor_id, repo_id) => {
    return await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getAuthorizedContributor(contributor_id: "${contributor_id}", repo_id: "${repo_id}") }`,
      })
      .set("accept", "json");
  },
  postPullFork: async (owner, repo, defaultHash, contributor_id) => {
    return await superagent
      .post("http://localhost:4001/graphql")
      .send({
        query: `{ getPRfork(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`,
      }) // sends a JSON post body
      .set("accept", "json");
  },
  postGetPRforkStatus: async (owner, repo, defaultHash, contributor_id) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getPRforkStatus(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`,
      }) // sends a JSON post body
      .set("accept", "json");
    //const resJSON = JSON.parseFromString(res.text)
    //console.log(resJSON)
    //return resJSON.data.getPRforkStatus
    const json = JSON.parse(res.text);
    return json.data.getPRforkStatus;
  },
  postGetPullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") { status, state, repo_id, fork_branch, defaultHash, childDefaultHash} }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getPullRequest;
  },
  getGitHubPullRequest: async (owner, repo, defaultHash) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getGitHubPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}") { status, mergeable, mergeCommitSha, state, baseBranch } }`,
      })
      .set("accept", "json");
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
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteTotals(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    console.log(json);
    return json.data.percentVotedQuorum;
  },
  postGetPRvoteTotals: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteTotals(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
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
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteYesTotals(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
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
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ getPRvoteNoTotals(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    //console.log(json)
    return json.data.getPRvoteNoTotals;
  },
  postClosePullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ closePullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
  postMergePullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ mergePullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post(`${port}/graphql`)
      .send({
        query: `{ createTsrcPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", head: "${head}", branchDefaultHash: "${branchDefaultHash}", remoteURL: "${remoteURL}", baseBranch: "${baseBranch}"fork_branch: "${fork_branch}", title: "${title}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createTsrcPullRequest;
  },
  postFork: async (owner, repo, org) => {
    superagent
      .post(`${port}/graphql`)
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        { query: `{ fork(owner: "${owner}", repo: "${repo}", org: "${org}") }` }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post("http://localhost:8081/graphql")
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ setContributorVotedTokens(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
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
      .post("http://localhost:8081/graphql")
      .send(
        //{ query: '{ name: 'Manny', species: 'cat' }' }
        //{ query: '{ newPullRequest(defaultHash: "first", contributorId: "1", side: 1) { vote_code } }' }
        //{ query: '{ getVote(defaultHash: "default", contributorId: 1) {side} }' }
        //{ query: '{ getVoteAll(defaultHash: "default") { vote_code } }' }
        //{ query: `{ getVoteEverything }` }
        {
          query: `{ addToTotalVotedYesTokens(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", tokens: "${tokens}") }`,
        }
        //{ query: '{ setVote(defaultHash: "default" contributorId: "2", side: 1 ) { vote_code }' }
      ) // sends a JSON post body
      .set("accept", "json")
      .end((err, res) => {
        // Calling the end function will send the request
      });
  },
};

module.exports = root;
