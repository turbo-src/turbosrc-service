const superagent = require("superagent");

const namespaceUrl =
  process.env.NODE_ENV === "fly"
    ? "https://namespace-db.fly.dev/graphql"
    : "http://localhost:4003/graphql"

var root = {
  postCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature,
    token
  ) => {
    const res = await superagent
      .post(namespaceUrl)
      .send({
        query: `{ createUser(owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createUser;
  },
  postGetContributorName: async (owner, repo, pr_id, contributor_id) => {
    const res = await superagent
      .post(namespaceUrl)
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
      .post(namespaceUrl)
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
  postGetContributorSignature: async (owner, repo, pr_id, contributor_id) => {
    const res = await superagent
      .post(namespaceUrl)
      .send({
        query: `{ getContributorSignature(owner: "${owner}", repo: "${repo}", pr_id: "${pr_id}", contributor_id: "${contributor_id}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorSignature;
  },
  getUser: async (contributor_id) => {
    const res = await superagent
      .post(namespaceUrl)
      .send({
        query: `{ getUser(contributor_id: "${contributor_id}") {contributor_name, contributor_id, contributor_signature, token}}`,
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getUser;
  },
};

module.exports = root;
