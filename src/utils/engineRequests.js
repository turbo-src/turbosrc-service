const superagent = require("superagent");


const { getServiceEndpoint } = require('./config')

//const privateStore =
//  process.env.NODE_ENV === "fly"
//    ? "https://private-store.fly.dev/graphql"
//    : "http://localhost:4002/graphql"

var root = {
  postCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature
  ) => {
    const privateStore = await getServiceEndpoint("offchain")
    superagent
      .post(privateStore)
      .send({
        query: `{ createUser(owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}") }`,
      })
      .set("accept", "json")
      .end((err, res) => {
        //Calling the end function will send the request
        const json = JSON.parse(res.text);
        return json.data.createUser;
      });
  },
  postCreateRepo: async (owner, repo, defaultHash, contributor_id, side) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ createRepo(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createRepo;
  },
  postCreatePullRequest: async (
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
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ createPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", head: "${head}", branchDefaultHash: "${branchDefaultHash}", remoteURL: "${remoteURL}", baseBranch: "${baseBranch}"fork_branch: "${fork_branch}", title: "${title}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createPullRequest;
  },
  createLinkedPullRequest: async (
    owner,
    repo,
    parentDefaultHash,
    defaultHash,
    childDefaultHash,
    head,
    branchDefaultHash,
    remoteURL,
    baseBranch,
    fork_branch,
    title
  ) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ createLinkedPullRequest(owner: "${owner}", repo: "${repo}", parentDefaultHash: "${parentDefaultHash}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", head: "${head}", branchDefaultHash: "${branchDefaultHash}", remoteURL: "${remoteURL}", baseBranch: "${baseBranch}"fork_branch: "${fork_branch}", title: "${title}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createLinkedPullRequest;
  },
  postGetContributorName: async (owner, repo, defaultHash, contributor_id) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getContributorName(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`,
      })
      .set("accept", "json");
    // .end((err, res) => {
    //   const json = JSON.parse(res.text);
    //   return json.data.getContributorName;
    // });
    const json = JSON.parse(res.text);
    return json.data.getContributorName;
  },
  postGetContributorID: async (owner, repo, defaultHash, contributor_name) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getContributorID(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_name: "${contributor_name}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorID;
  },
  postGetContributorSignature: async (owner, repo, defaultHash, contributor_name) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getContributorSignature(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_name: "${contributor_name}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorSignature;
  },
  getRepoStatus: async (repo_id) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
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
  postGetAuthorizedContributor: async (contributor_id, repo_id) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getAuthorizedContributor(contributor_id: "${contributor_id}", repo_id: "${repo_id}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getAuthorizedContributor;
  },
  postGetContributorTokenAmount: async (
    owner,
    repo,
    defaultHash,
    contributor_id,
    side
  ) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getContributorTokenAmount(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") { status, amount } }`,
      }) // sends a JSON post body
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorTokenAmount;
  },
  postTransferTokens: async (owner, repo, from, to, amount) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ transferTokens(owner: "${owner}", repo: "${repo}", from: "${from}", to: "${to}", amount: ${amount}) }`,
      }) // sends a JSON post body
      .set("accept", "json");
    //   .end((err, res) => {
    // Calling the end function will send the request
    //   });
    const json = JSON.parse(res.text);
    return json.data.transferTokens;
  },
  postSetVote: async (owner, repo, defaultHash, childDefaultHash, mergeable, contributor_id, side) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
	      query: `{ setVote(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", mergeable: ${mergeable}, contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //   .end((err, res) => {
    //      Calling the end function will send the request
    //   });
    const json = JSON.parse(res.text);
    return json.data.setVote;
  },
  postGetPullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getMostRecentLinkedPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") { status, state, repo_id, fork_branch, defaultHash, childDefaultHash, head, branchDefaultHash, remoteURL, baseBranch } }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getMostRecentLinkedPullRequest;
  },
  postSetQuorum: async (repo, contributor_id, quorum) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ setQuorum(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}", quorum: "${quorum}") }`,
      })
      .set("accept", "json")
      .end((err, res) => {
        // Calling the end function will send the request
      });
    const json = JSON.parse(res.text);
    return json.data.setQuorum;
  },
  postGetQuorum: async (repo) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getQuorum(repo: "${repo}") }`,
      })
      .set("accept", "json")
      .end((err, res) => {
        // Calling the end function will send the request
      });
    const json = JSON.parse(res.text);
    return json.data.getQuorum;
  },
  postGetPRvoteTotals: async (owner, repo, defaultHash, contributor_id, side) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getPRvoteTotals(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getPRvoteTotals;
  },
  postGetPRvoteYesTotals: async (owner, repo, defaultHash, contributor_id, side) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getPRvoteYesTotals(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getPRvoteYesTotals;
  },
  postGetPRvoteNoTotals: async (owner, repo, defaultHash, contributor_id, side) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ getPRvoteNoTotals(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getPRvoteNoTotals;
  },
  postGetVotes: async (repo, defaultHash, contributor_id) => {
    const privateStore = await getServiceEndpoint("offchain")
    const res = await superagent
      .post(privateStore)
      .send({
        query: `
        { getVotes(repo: "${repo}", defaultHash: "${defaultHash}", contributor_id:"${contributor_id}")
            { status,
              voteData {
                contributor {
                  voted, side, votePower, createdAt, contributor_id
                },
                voteTotals {
                  totalVotes, totalYesVotes, totalNoVotes, votesToQuorum, votesToMerge, votesToClose, totalVotePercent, yesPercent, noPercent 
                },
                votes { contributor_id, side, votePower, createdAt }
                },
              }
        }`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.getVotes;
  },
};

module.exports = root;
