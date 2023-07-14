const { Octokit } = require("octokit");
const fsPromises = require("fs").promises;
var path = require("path");
const { postGetContributorName } = require("./requests");
const { getJWT, getTurbosrcMode } = require("./config");

const { getUser } = require("./nameSpaceRequests");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const gitHubUtil = {
	getGithubToken: async function (user) {
		let apiToken;
		const data = await fsPromises
			.readFile(path.resolve(__dirname, "../../.config.json"))
			.catch((err) => console.error("Failed to read file", err));

		let json = JSON.parse(data);
		if (user === undefined) {
			apiToken = json.github.apiToken;
			user = json.github.user;
		} else {
			apiToken = json.testers[user].apiToken;
			user = json.testers[user].user;
		}
		if (apiToken === undefined) {
			throw new Error("Failed to load Github user " + user + "'s api key.");
		} else {
			console.log("Successfully read Github " + user + "'s api key.");
		}
		return apiToken;
	},
	verify: async function (contributor_id, token) {
		const onlineMode = await getTurbosrcMode();
		if (onlineMode === "offline") {
			return true;
		}

		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);
		try {
			if (!contributor_id || !token) {
				return false;
			}
			// Trade contributor_id for our contributor_name in our PG database
			// If contributor_name in ags above, then it is a createUser
			let githubUsername = await postGetContributorName(
				"",
				"",
				"",
				contributor_id
			);
			const octokit = new Octokit({ auth: tokenRes.githubToken });
			// If res was successful and was querying the user associated with the contributor_id return true
			const res = await octokit.request(`GET /users/${githubUsername}`);

			if (githubUsername === res.data.login) {
				console.log("verified token thru github");
				return true;
			} else {
				console.log("github token invalid", token);
				return false;
			}
		} catch (error) {
			console.log("error verifying github token", token);
			return 500;
		}
	},
	checkGithubTokenPermissions: async function (
		owner,
		repo,
		contributor_name,
		token
	) {
		if (!repo || !owner) {
			return;
		}
		let permissions = {};
		let octokit;
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);
		try {
			octokit = new Octokit({ auth: tokenRes.githubToken });
			//Check if user has public_repo scope:
			const scopesRes = await octokit.request(`GET /users/${contributor_name}`);

			Promise.resolve(scopesRes).then((object) => {
				if (
					object.headers["x-oauth-scopes"].split(",").includes("public_repo")
				) {
					permissions.public_repo_scopes = true;
				} else {
					permissions.public_repo_scopes = false;
				}
			});

			//Check if user has push permissions to this repo:
			const permissionsRes = await octokit.request(
				`GET /repos/${owner}/${repo}`
			);

			Promise.resolve(permissionsRes).then((object) => {
				if (object.data.permissions.push) {
					permissions.push_permissions = true;
				} else {
					permissions.push_permissions = false;
				}
			});

			return permissions;
		} catch (error) {
			console.log("error checking permissions of github token", tokenRes);
			permissions.public_repo_scopes = false;
			permissions.push_permissions = false;
			return permissions;
		}
	},
	getGitHubPullRequest: async function (owner, repo, pull, contributor_id) {
		let args = {};
		args.contributor_id = contributor_id;
		let res;
		let token;
		try {
			res = await getUser(contributor_id);
		} catch (error) {
			console.log("Error in getUser:", error);
		}
		try {
			token = res.token;
		} catch (error) {
			console.log(error);
		}

		const jwtTokenFromConfig = await getJWT();
		console.log(token);
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.githubToken });
		console.log(owner);
		console.log(repo);
		console.log(pull);
		try {
			const res = await octokit.request(
				`GET /repos/${owner}/${repo}/pulls/${pull}`
			);
			const data = res.data;

			return data;
		} catch (error) {
			return error;
		}
	},
	getPullRequest: async function (owner, repo, pull) {
		let token = await module.exports.getGithubToken();

		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.githubToken });

		const res = await octokit.request(
			`GET /repos/${owner}/${repo}/pulls/${pull}`
		);

		const data = res.data;
		const head = data.head;
		const oid = head.sha;
		const label = head.label.split(":");
		const contributor = label[0];
		const forkBranch = label[1];

		return { oid, contributor, forkBranch };
	},
	createPullRequest: async function (owner, repo, forkBranch, pull, title) {
		let token = await module.exports.getGithubToken();

		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.githubToken });

		await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
			owner: owner,
			repo: repo,
			title: title,
			body: "auto pull request",
			head: forkBranch,
			base: "master",
		});
	},
	closePullRequest: async function (owner, repo, pull) {
		let token = await module.exports.getGithubToken();
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.githubToken });

		await octokit.request(`PATCH /repos/${owner}/${repo}/pulls/${pull}`, {
			state: "closed",
		});
	},
	mergePullRequest: async function (owner, repo, defaultHash) {
		let token = await module.exports.getGithubToken();
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);
		const octokit = new Octokit({ auth: tokenRes.githubToken });
		const res = await octokit.request(
			`PUT /repos/${owner}/${repo}/pulls/${pull}/merge`
		);
	},
	fork: async function (owner, repo, org) {
		let token = await module.exports.getGithubToken();
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.githubToken });
		await octokit.rest.repos.createFork({ owner, repo });
	},
};

module.exports = gitHubUtil;
