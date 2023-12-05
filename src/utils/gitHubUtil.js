const { Octokit, App } = require("octokit");
const fsPromises = require("fs").promises;
const fs = require("fs").promises;
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
		console.log("user " + user);
		if (user === undefined) {
			apiToken = json.github.apiToken;
			user = json.github.user;
		} else {
			apiToken = json.testers[user].apiToken;
			user = json.testers[user].user;
		}
		if (apiToken === undefined) {
			throw new Error("Failed to load GitHub user " + user + "'s api key.");
		} else {
			console.log("Successfully read GitHub " + user + "'s api key.");
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
			let gitHubUsername = await postGetContributorName(
				"",
				"",
				"",
				contributor_id
			);

			// Case if this is a turboSrc token
			if (gitHubUsername === tokenRes.gitHubToken) {
				console.log("verified token thru turbosrc");
				return true;
			}

			const octokit = new Octokit({ auth: tokenRes.gitHubToken });
			// If res was successful and was querying the user associated with the contributor_id return true
			const res = await octokit.request(`GET /users/${gitHubUsername}`);

			if (gitHubUsername === res.data.login) {
				console.log("verified token thru gitHub");
				return true;
			} else {
				console.log("gitHub token invalid", token);
				return false;
			}
		} catch (error) {
			console.log("error verifying gitHub token", token);
			return 500;
		}
	},
	checkGitHubTokenPermissions: async function (
		owner,
		repo,
		contributor_name,
		token
	) {
		if (!repo || !owner) {
			return;
		}
		let permissions = {
			push_permissions: false,
			public_repo_scopes: false,
		};
		let octokit;
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		/* Logic if using a turboSrcToken: bypass public_repo_scopes and just
  check if contributor owns this repo or is a member of its organization */
		if (tokenRes.gitHubToken === contributor_name) {
			token = await module.exports.getGitHubToken();
			const instanceToken = jwt.verify(token, jwtTokenFromConfig);
			octokit = new Octokit({ auth: instanceToken.gitHubToken });

			permissions.public_repo_scopes = true;

			if (owner === contributor_name) {
				permissions.push_permissions = true;
				return permissions;
			}

			try {
				// If the owner of this repo is an organization, check if the contributor is one of its members:
				const { data } = await octokit.request(`GET /repos/${owner}/${repo}`);
				const gitHubRepo = data;
				if (gitHubRepo.owner.type === "Organization") {
					const members = await octokit.request(`GET /orgs/${owner}/members`);

					for (let i = 0; i < members.length; i++) {
						let member = members[i];
						if (member.login === contributor_name) {
							permissions.push_permissions = true;
							break;
						}
					}
				}
				console.log("->", gitHubRepo);
				console.log("perms from backend:", permissions);
				return permissions;
			} catch (error) {
				console.log("error fetching repo data from gitHub:", error);
			}
		} else {
			try {
				octokit = new Octokit({ auth: tokenRes.gitHubToken });
				//Check if user has public_repo scope:
				const scopesRes = await octokit.request(
					`GET /users/${contributor_name}`
				);

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
				console.log("error checking permissions of gitHub token", tokenRes);
				permissions.public_repo_scopes = false;
				permissions.push_permissions = false;
				return permissions;
			}
		}
	},
	getGitHubPullRequest: async function (owner, repo, pull, contributor_id) {
		const token = await module.exports.getGitHubToken();
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);
		const octokit = new Octokit({ auth: tokenRes.gitHubToken });

		try {
			const res = await octokit.request(
				`GET /repos/${owner}/${repo}/pulls/${pull}`
			);
			return res.data;
		} catch (error) {
			return error;
		}
	},
	getPullRequest: async function (owner, repo, pull) {
		let token = await module.exports.getGitHubToken();

		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.gitHubToken });

		console.log("gh 19");
		console.log(owner);
		console.log(repo);
		console.log(pull);
		const res = await octokit.request(
			`GET /repos/${owner}/${repo}/pulls/${pull}`
		); //, {
		console.log("gh 21");
		//await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
		//  owner: 'octocat',
		//  repo: 'hello-world',
		//  pull_number: 42
		//})
		//console.log(res)

		const data = res.data;
		const head = data.head;
		const oid = head.sha;
		const label = head.label.split(":");
		const contributor = label[0];
		const forkBranch = label[1];
		console.log(label);

		return { oid, contributor, forkBranch };
	},
	createPullRequest: async function (owner, repo, forkBranch, pull, title) {
		let token = await module.exports.getGithubToken();

		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.gitHubToken });
		console.log("gh 46");
		console.log(owner);
		console.log(repo);
		console.log(forkBranch);
		console.log(pull);

		const {data} = await octokit.request(`POST /repos/${owner}/${repo}/pulls`, {
			owner: owner,
			repo: repo,
			title: title,
			body: "auto pull request",
			head: forkBranch,
			base: "master",
		});
		console.log("gh 58`");
    return data
	},
	closePullRequest: async function (owner, repo, pull) {
		let token = await module.exports.getGitHubToken();
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.gitHubToken });
		console.log("gh 64");
		console.log(owner);
		console.log(repo);
		console.log(pull);

		await octokit.request(`PATCH /repos/${owner}/${repo}/pulls/${pull}`, {
			state: "closed",
			//base: 'master'
		});
		//await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
		//  owner: 'octocat',
		//  repo: 'hello-world',
		//  pull_number: 42,
		//  title: 'title'
		//})
		console.log("gh 51`");
	},
	mergePullRequest: async function (owner, repo, defaultHash) {
		let token = await module.exports.getGitHubToken();
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.gitHubToken });
		console.log("gh 67");
		console.log(owner);
		console.log(repo);
		console.log(defaultHash);
		const pull = defaultHash;

		const res = await octokit.request(
			`PUT /repos/${owner}/${repo}/pulls/${pull}/merge` //{
			//owner: 'octocat',
			//repo: 'hello-world',
			//pull_number: 42,
			//commit_title: 'commit_title'
			//}
		);

		console.log("gh 83`");
	},
	fork: async function (owner, repo, org) {
		let token = await module.exports.getGitHubToken();
		const jwtTokenFromConfig = await getJWT();
		const tokenRes = jwt.verify(token, jwtTokenFromConfig);

		const octokit = new Octokit({ auth: tokenRes.gitHubToken });
		console.log("gh 102");
		console.log(owner);
		console.log(repo);
		console.log(org);

		//await octokit.rest.repos.createFork({owner, repo, org})
		await octokit.rest.repos.createFork({ owner, repo });

		//await octokit.request(`PUT /repos/${owner}/${repo}/fork`, {
		//  organization: org,
		//  //repo: 'hello-world',
		//  //pull_number: 42,
		//  //commit_title: 'commit_title'
		//})

		console.log("gh 116`");
	},
	createGitHubFileBlob: async (
		gitHubAccessToken,
		repoFullName,
		content,
		encoding = "utf-8"
	) => {
		const octokit = new Octokit({ auth: gitHubAccessToken });
		let blobResp;

    try {
      blobResp = await octokit.request(`POST /repos/${repoFullName}/git/blobs`, {
        owner: repoFullName.split('/')[0],
        repo: repoFullName.split('/')[1],
        content: content,
        encoding: encoding,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
    } catch (error) {
      console.log('error file blob', error)
    }
		const response = blobResp;

		console.log('res', response)
    return response.sha;
	},
	getShaForBaseTree: async (gitHubAccessToken, repoFullName, branchName) => {
		const octokit = new Octokit({ auth: gitHubAccessToken });
		const baseTreeResp = await octokit.request(
			`GET /repos/${repoFullName}/git/trees/${branchName}`
		);
		const response = baseTreeResp.data;

		console.log('res 1', response)
    return response.sha;
	},
	getParentSha: async (gitHubAccessToken, repoFullName, branchName) => {
		const octokit = new Octokit({ auth: gitHubAccessToken });
		const parentResp = await octokit.request(
			`GET /repos/${repoFullName}/git/refs/heads/${branchName}`
		);
		const response = parentResp.data;

		console.log('res 2', response)
    return response.object.sha;
	},
	createGitHubRepoTree: async (
		gitHubAccessToken,
		repoFullName,
		branchName,
		articleFiles
	) => {
		const octokit = new Octokit({ auth: gitHubAccessToken });

		const shaForBaseTree = await module.exports.getShaForBaseTree(
			gitHubAccessToken,
			repoFullName,
			branchName
		);

		const tree = [];

		for (var i = 0; i < articleFiles.length; i++) {
			const fileSha = await module.exports.createGitHubFileBlob(
				gitHubAccessToken,
				repoFullName,
				articleFiles[i].content,
				articleFiles[i].encoding
			);
			tree.push({
				path: articleFiles[i].path.substring(1),
				mode: "100644",
				type: "blob",
				sha: fileSha,
			});
		}

		const treeResp = await octokit.request(`POST /repos/${repoFullName}/git/trees`, {
			base_tree: shaForBaseTree,
			tree: tree,
		});
		const response = treeResp.data;

		console.log('createGitHubTree res ', response)
    return response.sha;
	},
	createGitHubCommit: async function (
		repoFullName,
		branchName,
		commitMessage,
		articleFiles
	) {
		const jwtTokenFromConfig = await getJWT();
		const token = await module.exports.getGithubToken();
		const instanceToken = jwt.verify(token, jwtTokenFromConfig);
		const gitHubAccessToken = instanceToken.gitHubToken;

		const octokit = new Octokit({ auth: instanceToken.gitHubToken });

		const tree = await module.exports.createGitHubRepoTree(
			gitHubAccessToken,
			repoFullName,
			branchName,
			articleFiles
		);
		const parentSha = await module.exports.getParentSha(
			gitHubAccessToken,
			repoFullName,
			branchName
		);
      console.log('tree', tree)
      console.log('parentSha', parentSha)

		const response = octokit.request(`POST /repos/${repoFullName}/git/commits`, {
			message: commitMessage,
			tree: tree,
			parents: [parentSha],
		});

		const commitResp = response.data;
		const commitSha = commitResp.sha;

		await updateGitHubBranchRef(
			gitHubAccessToken,
			repoFullName,
			branchName,
			commitSha
		);
    console.log('create commit response:', response.data)
	},
	updateGitHubBranchRef: async (
		gitHubAccessToken,
		repoFullName,
		branchName,
		commitSha
	) => {
		const octokit = new Octokit({ auth: gitHubAccessToken });

		const response = await octokit.request(
			`PATCH /repos/${repoFullName}/git/refs/heads/${branchName}`,
			{
				sha: commitSha,
				force: false,
			}
		);

		const commitResp = response.data;
    console.log('update branch ref resp:', commitResp)
		console.log('res', response)
    return commitResp;
	},
};

module.exports = gitHubUtil;
