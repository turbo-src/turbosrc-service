const superagent = require("superagent");

const port = "http://localhost:4002";

var root = {
  postCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature
  ) => {
    superagent
      .post(`${port}/graphql`)
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
  postCreateRepo: async (owner, repo, pr_id, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ createRepo(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createRepo;
  },
  postCreatePullRequest: async (
    /*owner:*/ owner,
    /*repo:*/ repo,
    /*fork_branch:*/ fork_branch,
    /*pr_id:*/ pr_id,
    /*title:*/ title
  ) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ createPullRequest(owner: "${owner}", repo: "${repo}", fork_branch: "${fork_branch}", pr_id: "${pr_id}", title: "${title}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createPullRequest;
  },
  postGetContributorName: async (owner, repo, pr_id, contributor_id) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getContributorName(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}") }`,
      })
      .set("accept", "json");
    // .end((err, res) => {
    //   const json = JSON.parse(res.text);
    //   return json.data.getContributorName;
    // });
    const json = JSON.parse(res.text);
    return json.data.getContributorName;
  },
  postGetContributorID: async (owner, repo, pr_id, contributor_name) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getContributorID(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_name: "${contributor_name}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorID;
  },
  postGetContributorSignature: async (owner, repo, pr_id, contributor_name) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getContributorSignature(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_name: "${contributor_name}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorSignature;
  },
  postGetRepoStatus: async (repo_id) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getRepoStatus(repo_id: "${repo_id}" }`,
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
      .post(`${port}/graphql`)
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
    pr_id,
    contributor_id,
    side
  ) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getContributorTokenAmount(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}") }`,
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
      .post(`${port}/graphql`)
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
  postSetVote: async (owner, repo, pr_id, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ setVote(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //   .end((err, res) => {
    //      Calling the end function will send the request
    //   });
    const json = JSON.parse(res.text);
    return json.data.setVote;
  },
  postGetPRStatus: async (owner, repo, pr_id, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getPRStatus(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getPRStatus;
  },
  postSetQuorum: async (repo, contributor_id, quorum) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ setQuorum(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}", quorum: "${quorum}") }`,
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
      .post(`${port}/graphql`)
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
  postGetVoteTotals: async (owner, repo, pr_id, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getVoteTotals(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getVoteTotals;
  },
  postGetVoteYesTotals: async (owner, repo, pr_id, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getVoteYesTotals(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getVoteYesTotals;
  },
  postGetVoteNoTotals: async (owner, repo, pr_id, contributor_id, side) => {
    const res = await superagent
      .post(`${port}/graphql`)
      .send({
        query: `{ getVoteNoTotals(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}", side: "${side}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getVoteNoTotals;
  },
};

module.exports = root;
