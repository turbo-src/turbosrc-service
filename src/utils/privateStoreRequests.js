const superagent = require("superagent");

const privateStore =
  process.env.NODE_ENV === "fly"
    ? "https://private-store.fly.dev/graphql"
    : "http://localhost:4002/graphql"

var root = {
  postCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature
  ) => {
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
    fork_branch,
    title
  ) => {
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ createPullRequest(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", childDefaultHash: "${childDefaultHash}", fork_branch: "${fork_branch}", title: "${title}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createPullRequest;
  },
  postGetContributorName: async (owner, repo, defaultHash, contributor_id) => {
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
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ transferTokens(owner: "${owner}", repo: "${repo}", from: "${from}", to: "${to}", amount: "${amount}") }`,
      }) // sends a JSON post body
      .set("accept", "json");
    //   .end((err, res) => {
    // Calling the end function will send the request
    //   });
    const json = JSON.parse(res.text);
    return json.data.transferTokens;
  },
  postSetVote: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(privateStore)
      .send({
        query: `{ setVote(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //   .end((err, res) => {
    //      Calling the end function will send the request
    //   });
    const json = JSON.parse(res.text);
    return json.data.setVote;
  },
  postGetPullRequest: async (owner, repo, defaultHash, contributor_id, side) => {
    const res = await superagent
      .post(privateStore)
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
  postSetQuorum: async (repo, contributor_id, quorum) => {
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
    return json.data.getVoteTotals;
  },
  postGetPRvoteYesTotals: async (owner, repo, defaultHash, contributor_id, side) => {
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
};

module.exports = root;
