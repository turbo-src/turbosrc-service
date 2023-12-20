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
    const endpoint = await getServiceEndpoint("gh")
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
    console.log('gh service reqs res', json.data.getGitHubPullRequest)
		return json.data.getGitHubPullRequest;
	},
};

module.exports = root;
