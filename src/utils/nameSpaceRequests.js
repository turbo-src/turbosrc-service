const superagent = require("superagent");

const { getServiceEndpoint } = require('./config')

//const endpoint =
//  process.env.NODE_ENV === "fly"
//    ? "https://namespace-db.fly.dev/graphql"
//    : "http://localhost:4003/graphql"

var root = {
  postCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature,
    token
  ) => {
    const endpoint = await getServiceEndpoint("namespace")
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ createUser(owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") }`,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createUser;
  },
  postGetContributorName: async (owner, repo, defaultHash, contributor_id) => {
    const endpoint = await getServiceEndpoint("namespace")
    const res = await superagent
      .post(endpoint)
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
    const endpoint = await getServiceEndpoint("namespace")
    const res = await superagent
      .post(endpoint)
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
  postGetContributorSignature: async (owner, repo, defaultHash, contributor_id) => {
    const endpoint = await getServiceEndpoint("namespace")
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getContributorSignature(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`,
      })
      .set("accept", "json");
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorSignature;
  },
  getUser: async (contributor_id) => {
    console.log('made it to getUser')
    const endpoint = await getServiceEndpoint("namespace")
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getUser(contributor_id: "${contributor_id}") {contributor_name, contributor_id, contributor_signature, token}}`,
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
    const endpoint = await getServiceEndpoint("namespace")
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ findOrCreateUser(owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") {contributor_name, contributor_id, contributor_signature, token}}`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.findOrCreateUser;
  },
  findOrCreateNameSpaceRepo: async (
    repoName,
    repoID) => {
      const endpoint = await getServiceEndpoint("namespace")
      const res = await superagent
      .post(endpoint)
      .send({
        query: `{ findOrCreateRepo(repoName: "${repoName}", repoID: "${repoID}") {status, repoName, repoID, repoSignature, message}}`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    console.log('findorcreatenamespacerepo reqs json', json)
    return json.data.findOrCreateRepo;
  },
  getNameSpaceRepo: async (
    repoNameOrID) => {
      const endpoint = await getServiceEndpoint("namespace")
      const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getRepo(repoNameOrID: "${repoNameOrID}") {status, repoName, repoID, repoSignature, message}}`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.getRepo;
  },
};

module.exports = root;
