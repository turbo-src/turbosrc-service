const { getPRhead } = require("./../utils/pullForkUtil");
const {
        getContributorAddress,
      } = require('./../utils/config')
const {
	getPullRequest,
	getGitHubPullRequest,
	mergePullRequest,
	closePullRequest,
} = require("./../utils/gitHubUtil");
const { gitHeadUtil } = require("./../utils/gitHeadUtil");
const {
	postCreateRepoTestDB,
	postCreateTokenSupplyTestDB,
	postSetTSrepoHeadTestDB,
	postSetQuorumTestDB,
	postNewPullRequestTestDB,
	postSetContributorVotedTokensTestDB,
	postAddToTotalVotedYesTokensDB,
	//postSetVote,
} = require("./../utils/requests");
const {
	createLinkedPullRequest,
	postCreatePullRequest,
	postCreateRepo,
	postGetVotePowerAmount,
	postTransferTokens,
	postSetVote,
	postGetPullRequest,
	postGetPRvoteYesTotals,
	postGetPRvoteNoTotals,
	postGetPRvoteTotals,
	postGetAuthorizedContributor,
	getRepoStatus,
	postGetVotes,
	postGetRepoData,
} = require("./../utils/engineRequests");
const {
	postCreateUser,
	postGetContributorID,
	postGetContributorName,
	postGetContributorSignature,
	getUser,
	findOrCreateUser,
	findOrCreateNameSpaceRepo,
	getNameSpaceRepo,
} = require("./../utils/nameSpaceRequests");

const {
	postCreateIssue,
	postGetIssueID,
	postGetTsrcID,
} = require("./../utils/ghServiceRequests");

const { getTurbosrcMode } = require("./../utils/config");

const {
	//createRepo,
	createTokenSupply,
	//transferTokens,
	setQuorum,
	newPullRequest,
	setContributorVotedTokens,
	getContributorTokens,
	getTSpullRequest,
	getAllTSpullRequests,
	deleteTSpullRequest,
	getContributorVotedTokens,
	getAllVotedTokens,
	getQuorum,
	getTokenSupply,
	getTotalVotedTokens,
	getTotalVotedYesTokens,
	getTotalVotedNoTokens,
	addToTotalVotedTokens,
	addToTotalVotedYesTokens,
	addToTotalVotedNoTokens,
	//setVoteSide,
	getOpenPullRequest,
	setOpenPullRequest,
	setTSrepoHead,
	getTSrepoHead,
	setPullRequestStatus,
	addToMergePullRequestHistory,
	addToRejectPullRequestHistory,
	getPullRequestFromHistory,
	//getRepoStatus,
	checkContributor,
	checkMergePullRequestHistory,
	checkRejectPullRequestHistory,
	//getVotePowerAmount
} = require("./state");

async function getGitHubPRhead(owner, repo, issueID, contributor_id) {
	issueID = issueID.split("_")[1]; // Need this for check gitHubPullRequest.
	const gitHubPullRequest = await getGitHubPullRequest(
		owner,
		repo,
		issueID,
		contributor_id
	);
	const head = gitHubPullRequest.head.sha;
	const mergeable = gitHubPullRequest.mergeable;
	return { head: head, mergeable: mergeable };
}

async function convertIssueID(repoID, issueID, write, contributor_id) {
	// This will exchange the issueID (eg. issue_4) into a tsrcID (e.g. commit head sha256).
	// It will also record the sha256 against the issueID for future reference.

	// childDefaultHash is the most recent commit head sha256 of the pull request branch
	// defaultHash is the next most recent commit head sha256 of the pull request branch

	console.log('repoID in convertIssueID\n\n', repoID)
	const { repoName } = await getNameSpaceRepo(repoID);
	const owner = repoName.split("/")[0];
	const repo = repoName.split("/")[1];

	let head;
	let ghService;
	let res = {
		status: 201,
		mergeable: true,
		defaultHash: "",
		childDefaultHash: "",
	};

	try {
		// Get tsrcID from GH service
		ghService = await postGetTsrcID(repoID, issueID);
		// Get pull request from GitHub
		const githubRes = await getGitHubPRhead(
			owner,
			repo,
			issueID,
			contributor_id
		);
		console.log('githubRes in convertIssueID\n\n', githubRes)
		head = githubRes.head;
		res.mergeable = githubRes.mergeable;

		// Error handling
		if (head === null || head === undefined) {
			throw new Error();
		}

		// The tsrcID is already the most up to date commit head
		if (ghService.tsrcID === head) {
			res.defaultHash = head;
			res.childDefaultHash = head;
			return res;
		} else if (ghService.status === 200 && ghService.tsrcID !== head) {
			// The tsrcID is older so update the childDefaultHash to be the new head
			// and bump the defaultHash to be the tsrcID ie. old commit head
			res.defaultHash = ghService.tsrcID;
			res.childDefaultHash = head;
			return res;
		}

		if (write) {
			//If write is true, then create a new issue in the GH service for future reference
			const resCreateIssue = await postCreateIssue(repoID, issueID, head);
			if (resCreateIssue.status === 201) {
				res.defaultHash = head;
				res.childDefaultHash = head;
				return res;
			} else {
			    console.log('resCreateIssue in convertIssueID\n\n', resCreateIssue)
				throw new Error();
			}
		}
	} catch (error) {
		res.status = 500;
		res.defaultHash = issueID;
		res.childDefaultHash = issueID;
		return res;
	}
}

const root = {
	createTsrcPullRequest: async (args) => {
		const res = await postCreatePullRequest(
			args.owner,
			args.repo,
			args.defaultHash,
			args.childDefaultHash,
			args.head,
			args.branchDefaultHash,
			args.remoteURL,
			args.baseBranch,
			args.fork_branch,
			args.title,
			args.issue_id
		);
		return res;
	},
	// Also a root 'methods' in graphql query, by the same name
	getPRvote: function (database, args) {
		const defaultHash = args.defaultHash;

		const tsPullRequest = getTSpullRequest(database, args);

		if (typeof tsPullRequest === "undefined") {
			return undefined;
		} else {
			const votedTokens = getContributorVotedTokens(database, args);
			return votedTokens;
		}
	},
	getPRvoteYesTotals: async function (args) {
		console.log("yes:", args.contributor_id);
		const convertedHashes = await convertIssueID(
			args.repo,
			args.defaultHash,
			false,
			args.contributor_id
		);
		if (convertedHashes.status === 201) {
			args.defaultHash = convertedHashes.defaultHash;
			args.childDefaultHash = convertedHashes.childDefaultHash;
		}

		console.log(
			"convertedHash:",
			args.defaultHash,
			convertedHashes.defaultHash
		);

		const voteYes = postGetPRvoteYesTotals(
			args.owner,
			args.repo,
			args.defaultHash,
			args.contributor_id,
			""
		);

		return voteYes;
	},
	getVotes: async (repoID, defaultHash, contributor_id) => {
		const { repoName } = await getNameSpaceRepo(repoID);
		const owner = repoName.split("/")[0];
		const repo = repoName.split("/")[1];
		const pull = defaultHash.split("_")[1]; // issue_1 becomes 1 for github api
		let response = {};
		let convertedHash = {};
		// Step 1: convert the issue_id of the PR to the defaultHash, ie the head
		// default hash in the args here is the issue_id :)
		// If it is a brand new pr not in our db then it will return undefined so just use the default hash, er.. issue_id :)
		convertedHash =
			(await convertIssueID(repoID, defaultHash, false, contributor_id)) ||
			defaultHash;

		// Step 2: If there is no PR in our db, we just set pull request contributor data from our db and pr meta data below from github
		response = await postGetVotes(
			repoID,
			convertedHash.defaultHash,
			contributor_id
		);

		const githubRes = await getGitHubPullRequest(
			owner,
			repo,
			pull,
			contributor_id
		);

		if (githubRes.mergeable === false && (response.state === "open" || response.state === "pre-open" || response.state === "vote")) {
			//response.state = "conflict"
		}
		response.mergeable = githubRes.mergeable

		if (response.status === 404) {
			// Step 3: Set pull request meta data from Github if pr is not in our db

			const { inSession } = await postGetRepoData(repoID, contributor_id);

			response.status = 200;
			response.title = githubRes.title || "unable to fetch pull request data";
			response.remoteURL = githubRes.url || "unable to fetch pull request data";
			response.baseBranch =
				githubRes.base.ref || "unable to fetch pull request data";
			response.forkBranch =
				githubRes.head.ref || "unable to fetch pull request data";
			response.defaultHash =
				githubRes.head.sha || "unable to fetch pull request data";
			response.childDefaultHash =
				githubRes.head.sha || "unable to fetch pull request data";
			response.mergeable = githubRes.mergeable;
			response.state = inSession
				? "frozen"
				: githubRes.mergeable
				? "vote"
				: "conflict";

			// Map the issue id to its sha for future reference
			await postCreateIssue(repoID, defaultHash, githubRes.head.sha);

			await postCreatePullRequest(
				"",
				repoID,
				githubRes.head.sha,
				githubRes.head.sha,
				githubRes.head.sha,
				githubRes.head.sha,
				githubRes.url,
				githubRes.base.ref,
				githubRes.head.ref,
				githubRes.title,
				defaultHash
			);
		}
		return response;
	},
	getRepoData: async (repo_id, contributor_id) => {
		let response = await postGetRepoData(repo_id, contributor_id);
		return response;
	},
	getPRvoteNoTotals: async function (args) {
		console.log("no:", args.contributor_id);
		const convertedHashes = await convertIssueID(
			args.repo,
			args.defaultHash,
			false,
			args.contributor_id
		);
		if (convertedHashes.status === 201) {
			args.defaultHash = convertedHashes.defaultHash;
			args.childDefaultHash = convertedHashes.childDefaultHash;
		}
		const voteNo = await postGetPRvoteNoTotals(
			args.owner,
			args.repo,
			args.defaultHash,
			args.contributor_id,
			""
		);

		return voteNo;
	},
	getPRvoteTotals: async function (args) {
		console.log("totals:", args.contributor_id);
		const convertedHashes = await convertIssueID(
			args.repo,
			args.defaultHash,
			false,
			args.contributor_id
		);
		if (convertedHashes.status === 201) {
			args.defaultHash = convertedHashes.defaultHash;
			args.childDefaultHash = convertedHashes.childDefaultHash;
		}
		const vote = await postGetPRvoteTotals(
			args.owner,
			args.repo,
			args.defaultHash,
			args.contributor_id,
			""
		);

		return vote;
	},
	getVotePowerAmount: async function (database, args) {
		//const contributorTokenAmount = getVotePowerAmount(database, args)
		const contributorTokenAmount = await postGetVotePowerAmount(
			"",
			args.repo,
			args.defaultHash,
			args.contributor_id,
			args.side
		);
		return contributorTokenAmount;
	},
	getPullRequest: async function (args) {
		console.log("pr:", args.contributor_id);
		const convertedHashes = await convertIssueID(
			args.repo,
			args.defaultHash,
			false,
			args.contributor_id
		);
		let mergeableCodeHost = true;
		if (convertedHashes.status === 201) {
			args.defaultHash = convertedHashes.defaultHash;
			args.childDefaultHash = convertedHashes.childDefaultHash;
		}
		mergeableCodeHost = convertedHashes.mergeable;
		console.log("mergeableCodeHost", mergeableCodeHost);
		let status = await postGetPullRequest(
			args.owner,
			args.repo,
			args.defaultHash,
			"",
			""
		);

		console.log("getPR", status);

		if (mergeableCodeHost === true || mergeableCodeHost === false) {
			status.mergeableCodeHost = mergeableCodeHost;
		} else {
			status.mergeableCodeHost = true;
		}

		return status;
	},
	pullAndVoteStatus: async function (database, pullReqRepoHead, args) {
		const defaultHash = args.defaultHash;
		var votedAlready;

		const activePullRequests = getAllTSpullRequests(database, args);
		const numberActivePullRequests = Object.keys(activePullRequests).length;

		//Fix: shouldn't make state changes in status check.
		if (numberActivePullRequests === 0) {
			database = setOpenPullRequest(database, args, defaultHash);
		}
		const openPullRequest = getOpenPullRequest(database, args);

		const tokens = getContributorTokens(database, args);

		// We can only use the function if there asking for about a
		// specific pull request.
		console.log("owner " + args.owner);
		console.log("repo " + args.repo);
		console.log("defaultHash " + defaultHash);
		console.log("tokens " + tokens);

		const prVoteStatusNow = module.exports.getPullRequest(database, args);
		if (prVoteStatusNow === "none") {
			votedAlready = false;
		} else {
			const allVotedTokens = getAllVotedTokens(database, args);
			votedAlready = Object.keys(allVotedTokens).includes(args.contributor_id);
			console.log(args.contributor_id + " voted already: " + votedAlready);
		}

		const openPullRequestStatus =
			openPullRequest === defaultHash || openPullRequest === "";

		console.log("op pr status: " + openPullRequestStatus);

		const alreadyHead = pullReqRepoHead === getTSrepoHead(database, args);

		console.log("pullReqHead");
		console.log(pullReqRepoHead);
		console.log(getTSrepoHead(database, args));
		console.log(alreadyHead);

		console.log("s 391");
		const closedMerge =
			prVoteStatusNow === "closed" || prVoteStatusNow === "merge";
		console.log(
			!closedMerge && !votedAlready && openPullRequestStatus && !alreadyHead
		);

		const pullAndVoteStatus =
			!closedMerge && !votedAlready && openPullRequestStatus && !alreadyHead;

		return {
			pullAndVoteStatus: pullAndVoteStatus,
			db: database,
		};
		//return {
		//         prVoteStatusNow: prVoteStatusNow,
		//         votedAlready: votedAlready,
		//         openPullRequestStatus: openPullRequestStatus,
		//         alreadyHead: alreadyHead
		//}
	},
	setVote: async function (args) {
		const { repoName } = await getNameSpaceRepo(args.repo);
		const owner = repoName.split("/")[0];
		const repo = repoName.split("/")[1];

		// Need this for check gitHubPullRequest
		const issueID = args.defaultHash.split("_")[1];
		const issue_id = args.defaultHash;
		// If ran online, it will find the default hash's associated tsrcID in GH Service
		convertedHashes = await convertIssueID(
			args.repo,
			args.defaultHash,
			true,
			args.contributor_id
		);

		if (convertedHashes.status === 201) {
			args.defaultHash = convertedHashes.defaultHash;
			args.childDefaultHash = convertedHashes.childDefaultHash;

			let mergeable;

			let prVoteStatus = await postGetPullRequest(
				owner,
				repo,
				args.defaultHash,
				args.contributor_id,
				args.side
			);

			const gitHubPullRequest = await getGitHubPullRequest(
				owner,
				repo,
				Number(issueID),
				args.contributor_id
			);

			console.log('gitHupPullRequest', gitHubPullRequest)

			if (gitHubPullRequest === undefined || gitHubPullRequest === null) {
				console.log("Can't vote because trouble finding Github Pull request.");
			}

			mergeable = gitHubPullRequest.mergeable;
			const baseBranch = gitHubPullRequest.base.ref;
			const forkBranch = gitHubPullRequest.head.ref;
			const head = gitHubPullRequest.head.sha;
			const remoteURL = gitHubPullRequest.head.repo.git_url;
			const title = gitHubPullRequest.title;

			if (mergeable === null) {
				mergeable = false;
			}

			//Pull requests only exist in our db if they have been voted on
			//If this is a pull request which has not been voted on yet, create it:
			if (prVoteStatus.status === 404) {
				console.log("theory: postCreatePullRequest")
				await postCreatePullRequest(
					args.owner,
					args.repo,
					args.defaultHash,
					args.childDefaultHash,
					head, // get head
					args.branchDefaultHash,
					remoteURL, // get remoteURl
					baseBranch, // get baseBranch
					forkBranch, // get forkBranch
					title, // get title
					issue_id
				);
			} else if (args.defaultHash !== args.childDefaultHash && mergeable) {
				console.log("PR updated and is mergeable, not in conflict.");

				// The linked PR will inherit the votes from its parent PR
				const resLinkedPR = await createLinkedPullRequest(
					args.owner,
					args.repo,
					args.defaultHash,
					args.childDefaultHash,
					args.childDefaultHash,
					args.childDefaultHash,
					"branchDefaultHash",
					remoteURL,
					baseBranch,
					forkBranch,
					title
				);

				if (resLinkedPR === "201") {
					console.log("Created mergeable linked pr.");
					// New linked pr has default and child that's same as the child of the parent.
					args.defaultHash = args.childDefaultHash;
				} else {
					console.log("problem creating linked pull request");
				}
			} else if (args.defaultHash !== args.childDefaultHash && !mergeable) {
				console.log("PR updated but is unmergeable, is in conflict");
			}

			// Now that is established which head of the PR we are voting on, we can create the vote:
			const resSetVote = await postSetVote(
				args.owner,
				args.repo,
				args.defaultHash,
				args.childDefaultHash,
				mergeable,
				args.contributor_id,
				args.side
			);
			console.log("theory: resSetVote")
			console.log(args)
			console.log(resSetVote)

			// Now get the vote totals for the PR:
			prVoteStatus = await postGetPullRequest(
				args.owner,
				args.repo,
				args.defaultHash,
				args.contributor_id,
				args.side
			);

			console.log("theory: postGetPullRequest")
			console.log(prVoteStatus)

			// Merge if turborsc pull request status says there are enough votes to merge.
			if (prVoteStatus.status === 200 && prVoteStatus.state === "merge") {
				// Comment out line below to disable actual merging into the codebase. Status will still be merged in our db either way:
				// await mergePullRequest(args.owner, args.repo, Number(issueID))
			}

			return resSetVote;
		} else {
			console.log('args converIssueID called\n\n', args)
			console.log('conertedHashes converIssueID called\n\n', args.convertedHashes)
			return 403;
		}
	},
	updatePullRequest: async function (database, args, tokens) {
		const defaultHash = args.defaultHash;
		const prVoteStatusNow = module.exports.getPullRequest(database, args);
		console.log(database);
		prVoteStatusUpdated = prVoteStatusNow;

		if (prVoteStatusNow === "open") {
			await postSetContributorVotedTokensTestDB(
				args.owner,
				args.repo,
				args.defaultHash,
				args.contributor_id,
				args.side,
				tokens
			);

			//To be deprecated for above.
			database = setContributorVotedTokens(database, args, tokens, args.side);

			console.log("upr 212");

			database = setVoteSide(database, args);

			//Add yes and not votes to tally.
			database = addToTotalVotedTokens(database, args, tokens);
			if (args.side === "yes") {
				await postAddToTotalVotedYesTokensDB(
					args.owner,
					args.repo,
					args.defaultHash,
					args.contributor_id,
					args.side,
					tokens
				);

				//To be deprecated for above.
				database = addToTotalVotedYesTokens(database, args, tokens);
			} else {
				database = addToTotalVotedNoTokens(database, args, tokens);
			}

			prVoteStatusUpdated = module.exports.getPullRequest(database, args);

			database = setPullRequestStatus(database, args, prVoteStatusUpdated);

			console.log("upr 228");
		}

		// Maybe should have index increment to know if updated or not
		return {
			db: database,
			prVoteStatusUpdated: prVoteStatusUpdated,
		};
	},
	transferTokens: async (database, pullRequestsDB, args) => {
		const resTransferTokens = await postTransferTokens(
			"",
			args.repo,
			args.from,
			args.to,
			args.amount
		);

		return resTransferTokens;
	},
	createUser: async (args) => {
		const resCreateUser = await postCreateUser(
			"",
			"",
			args.contributor_id,
			args.contributor_name,
			args.contributor_signature,
			args.token
		);

		// May need to implement in privateStore
		//database = setTSrepoHead(database, args, head)

		return resCreateUser;
	},
	getUser: async (args) => {
		const resgetUser = await getUser(args.contributor_id);
		return resgetUser;
	},
	findOrCreateUser: async (args) => {
		const resFindOrCreateUser = await findOrCreateUser(
			"",
			"",
			args.contributor_id,
			args.contributor_name,
			args.contributor_signature,
			args.token
		);
		return resFindOrCreateUser;
	},
	getContributorName: async (args) => {
		// If not found, error is "There was an error: TypeError: Cannot read properties of null (reading 'contributor_name')"
		const resGetContributorName = await postGetContributorName(
			"",
			"",
			"",
			args.contributor_id
		);

		// May need to implement in privateStore
		//database = setTSrepoHead(database, args, head)

		return resGetContributorName;
	},
	getContributorID: async (args) => {
		const resGetContributorID = await postGetContributorID(
			"",
			"",
			"",
			args.contributor_name
		);

		// May need to implement in privateStore
		//database = setTSrepoHead(database, args, head)

		return resGetContributorID;
	},
	getContributorSignature: async (args) => {
		const resGetContributorSignature = await postGetContributorSignature(
			"",
			"",
			"",
			args.contributor_id
		);

		// May need to implement in privateStore
		//database = setTSrepoHead(database, args, head)

		return resGetContributorSignature;
	},
	createRepo: async (args) => {
		// Create a namespace entry for the new repo:
		repoName = `${args.owner}/${args.repo}`
		const resCreateNameSpaceRepo = await findOrCreateNameSpaceRepo(
			repoName,
			""
		);

		// Create the repo with the unique ID generated from namespace:
		const resCreateRepo = await postCreateRepo(
			"",
			resCreateNameSpaceRepo.repoID,
			args.defaultHash,
			args.contributor_id,
			args.side
			// args.head?
		);

		//{"data":{"createRepo":{"status":201,"repoName":"7db9a/demo","repoID":"0x42d","repoSignature":"0x197e","message":"repo created"}}}


		return resCreateNameSpaceRepo
	},
	newPullRequest: async (database, pullRequestsDB, args) => {
		const prVoteStatus = module.exports.getPullRequest(database, args);

		const resNewPullRequest = newPullRequest(
			database,
			pullRequestsDB,
			args,
			prVoteStatus
		);

		await postNewPullRequestTestDB(
			args.owner,
			args.repo,
			args.defaultHash,
			args.contributor_id,
			args.side,
			prVoteStatus
		);

		//To be deprecated for above.
		database = resNewPullRequest.db;
		pullRequestsDB = resNewPullRequest.pullRequestsDB;

		return {
			pullRequestsDB: pullRequestsDB,
			db: database,
		};
	},
	getActivePullRequestsCount: function (database, args) {
		const activePullRequests = getAllTSpullRequests(database, args);
		const numberActivePullRequests = Object.keys(activePullRequests).length;

		return numberActivePullRequests;
	},
	getRepoStatus: async function (args) {
		const res = await getRepoStatus(args.repo_id);

		return res;
	},
	getContributors: function (database, args) {
		const status = getRepoStatus(database, args);

		return status;
	},
	getAuthorizedContributor: async function (args) {
		const res = await postGetAuthorizedContributor(
			args.contributor_id,
			args.repo_id
		);
		return res;
	},
	checkMergePullRequestHistory: function (pullRequestVoteMergeHistory, args) {
		const status = checkMergePullRequestHistory(
			pullRequestVoteMergeHistory,
			args
		);

		return status;
	},
	checkRejectPullRequestHistory: function (pullRequestVoteCloseHistory, args) {
		const status = checkRejectPullRequestHistory(
			pullRequestVoteCloseHistory,
			args
		);

		return status;
	},
	findOrCreateNameSpaceRepo: async function (args) {
		const res = await findOrCreateNameSpaceRepo(args.repoName, args.repoID);
		return res;
	},
	getNameSpaceRepo: async function (args) {
		const res = await getNameSpaceRepo(args.repoNameOrID);
		return res;
	},
        getTurboSrcIDfromInstance: async function() {
          const turboSrcID = await getContributorAddress()
          return turboSrcID
        },
};

module.exports = root;
