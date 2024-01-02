const superagent = require("superagent");

const { getServiceEndpoint } = require('./config')

//const port =
//  process.env.NODE_ENV === "fly"
//    ? "https://gh-service.fly.dev/graphql "
//    : "http://localhost:4004";

var root = {
  postCreateIssue: async (
    repo,
    issue_id,
    tsrc_id
  ) => {
  const endpoint = await getServiceEndpoint("gh")
  const res = await superagent
      .post(endpoint)
      .send({
        query: `{ createIssue(repo: "${repo}", issue_id: "${issue_id}", tsrc_id: "${tsrc_id}") {status, tsrcID, issueID, message} }`,
      })
      .set("accept", "json")
      const json = JSON.parse(res.text);
      return json.data.createIssue;
  },
  postGetIssueID: async (repo, tsrc_id) => {
    const endpoint = await getServiceEndpoint("gh")
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getIssueID(repo: "${repo}", tsrc_id: "${tsrc_id}") {status, tsrcID, issueID, message} }`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.getIssueID;
  },
  postGetTsrcID: async (repo, issue_id) => {
    const endpoint = await getServiceEndpoint("gh")
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getTsrcID(repo: "${repo}", issue_id: "${issue_id}") {status, tsrcID, issueID, message} }`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.getTsrcID;
  },
  getGitHubPullRequest: async (owner, repo, pull, accessToken) => {
    const endpoint = await getServiceEndpoint("gh");
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getGitHubPullRequest(owner: "${owner}", repo: "${repo}", pull: ${pull}, accessToken: "${accessToken}")
        {
          status,
          message,
          issue_url,
          number,
          state,
          title,
          head {
            label,
            ref,
            sha,
          repo {
            git_url,
          },
          },
          base {
            label,
            ref,
            sha,
          },
          merged,
          mergeable,
        }
      }`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.getGitHubPullRequest;
  },
  mergeGitHubPullRequest: async (owner, repo, pull, accessToken) => {
    const endpoint = await getServiceEndpoint("gh");
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ mergeGitHubPullRequest(owner: "${owner}", repo: "${repo}", pull: "${pull}", accessToken: "${accessToken}") {status, message} }`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.mergeGitHubPullRequest;
  },
  closeGitHubPullRequest: async (owner, repo, pull, accessToken) => {
    const endpoint = await getServiceEndpoint("gh");
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ closeGitHubPullRequest(owner: "${owner}", repo: "${repo}", pull: "${pull}", accessToken: "${accessToken}") {status, message} }`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.mergeGitHubPullRequest;
  },
  checkGitHubAccessTokenPermissions: async (
    owner,
    repo,
    accessToken,
    contributorName,
    instanceToken
  ) => {
    const endpoint = await getServiceEndpoint("gh");
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ checkGitHubAccessTokenPermissions(owner: "${owner}", repo: "${repo}", accessToken: "${accessToken}", contributorName: "${contributorName}", instanceToken: "${instanceToken}") { status, message, public_repo_scopes, push_permissions } }`,
      })
      .set("accept", "json");
    const json = JSON.parse(res.text);
    return json.data.checkGitHubAccessTokenPermissions;
  },
  verify: async (contributorName, token) => {
    const endpoint = await getServiceEndpoint("gh");
		const res = await superagent
			.post(endpoint)
			.send({
				query: `{ verify(contributorName: "${contributorName}", token: "${token}") { status, verified } }`,
			})
			.set("accept", "json");
		const json = JSON.parse(res.text);
		return json.data.verify;
	},
  createGitHubPullRequest: async (owner, repo, title, body, forkBranch, base, accessToken) => {
    const endpoint = await getServiceEndpoint("gh");
		const res = await superagent
			.post(endpoint)
			.send({
				query: `{ createGitHubPullRequest(owner: "${owner}", repo: "${repo}", title: "${title}", body: "${body}", forkBranch: "${forkBranch}", base: "${base}", accessToken: "${accessToken}") { status, message } }`,
			})
			.set("accept", "json");
		const json = JSON.parse(res.text);
		return json.data.createGitHubPullRequest;
	},
  createGitHubRepoFork: async (owner, repo, organization, name, defaultBranchOnly, accessToken) => {
    const endpoint = await getServiceEndpoint("gh");
		const res = await superagent
			.post(endpoint)
			.send({
				query: `{ createGitHubRepoFork(owner: "${owner}", repo: "${repo}", organization: "${organization}", name: "${name}", defaultBranchOnly: ${defaultBranchOnly}, accessToken: "${accessToken}") { status, message } }`,
			})
			.set("accept", "json");
		const json = JSON.parse(res.text);
		return json.data.createGitHubRepoFork;
	},
};

module.exports = root;
