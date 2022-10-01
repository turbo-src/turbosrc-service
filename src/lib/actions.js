const { getPRhead } = require("./../utils/pullForkUtil");
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
  postCreatePullRequest,
  postCreateRepo,
  postGetContributorTokenAmount,
  postTransferTokens,
  postSetVote,
  postGetPullRequest,
  postGetPRvoteYesTotals,
  postGetPRvoteNoTotals,
  postGetPRvoteTotals,
  postGetAuthorizedContributor,
  getRepoStatus,
} = require("./../utils/privateStoreRequests");
const {
  postCreateUser,
  postGetContributorID,
  postGetContributorName,
  postGetContributorSignature,
  getUser
} = require("./../utils/nameSpaceRequests");

const {
  postCreateIssue,
  postGetIssueID,
  postGetTsrcID
} = require("./../utils/ghServiceRequests");

const {
        getTurbosrcMode
      } = require('./../utils/config')

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
  //getContributorTokenAmount
} = require("./state");

async function getGitHubPRhead(owner, repo, issueID) {
    issueID = (issueID).split('_')[1] // Need this for check gitHubPullRequest.
    const gitHubPullRequest = await getGitHubPullRequest(owner, repo, issueID)

    return gitHubPullRequest.head.sha
}

async function convertDefaultHash(owner, repo, defaultHash) {
    // When online it'll transform the defaultHash (e.g. issueID) into a tsrcID (e.g. PR commit head oid).
    // It'll also record the defaultHash against the tsrcID for later use.
    const onlineMode = await getTurbosrcMode()
    if (onlineMode === 'online') {
      console.log('args 100')
      console.log(owner)
      console.log(repo)
      console.log(defaultHash)
      const tsrcID = await getGitHubPRhead(owner, repo, defaultHash)

      let resPostTsrcID = await postCreateIssue(`${owner}/${repo}`, tsrcID, defaultHash)
      if (resPostTsrcID === 201) {
        return tsrcID
      } else {
        return defaultHash
      }
    } else {
      let resPostTsrcID = await postCreateIssue(`${owner}/${repo}`, defaultHash, defaultHash)
      if (resPostTsrcID === 201) {
        return defaultHash
      } else {
	return 500
      }
    }

    return defaultHash
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
      args.title
    );
    return res
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
    const voteYes = postGetPRvoteYesTotals(
      args.owner,
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      args.contributor_id,
      ""
    );

    return voteYes;
  },
  getPRvoteNoTotals: async function (args) {
    const voteNo = await postGetPRvoteNoTotals(
      args.owner,
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      args.contributor_id,
      ""
    );

    return voteNo;
  },
  //getPRvoteTotals: async function (args) {
  // const vote = await postGetPRvoteTotals(
  //     args.owner,
  //     `${args.owner}/${args.repo}`,
  //     args.defaultHash,
  //     args.contributor_id,
  //     "",
  // )

  // return vote
  //},
  getContributorTokenAmount: async function (database, args) {
    //const contributorTokenAmount = getContributorTokenAmount(database, args)
    const contributorTokenAmount = await postGetContributorTokenAmount(
      "",
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      args.contributor_id,
      args.side
    );
    return contributorTokenAmount;
  },
  getPullRequest: async function (args) {
    const status = await postGetPullRequest(
      args.owner,
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      "",
      ""
    );

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
    console.log(args)
    const onlineMode = await getTurbosrcMode()
    console.log('')
    console.log('onlineMode', onlineMode)
    console.log('')
    const issueID = (args.defaultHash).split('_')[1] // Need this for check gitHubPullRequest.
    // If ran online, it'll convert the defaultHashs into a tsrcIDs.
    const originalDefaultHash = args.defaultHash
    args.defaultHash = await convertDefaultHash(args.owner, args.repo, args.defaultHash)
    if (originalDefaultHash === args.childDefaultHash) {
      args.childDefaultHash = args.defaultHash
    } else {
      args.childDefaultHash = await getGitHubPRhead(args.owner, args.repo, originalDefaultHash)
      args.childDefaultHash = await convertDefaultHash(args.owner, args.repo, args.childDefaultHash)
    }

    console.log('args after')
    console.log(args)
    let mergeable
    let prVoteStatus = await postGetPullRequest(
      args.owner,
      args.repo,
      args.defaultHash,
      args.contributor_id,
      args.side
    );

    if (prVoteStatus.status === 404) {
      // get github pull request to get below data
      // to pass into below arguments.
      
      const gitHubPullRequest = await getGitHubPullRequest(args.owner, args.repo, Number(issueID))
      
      if (gitHubPullRequest === undefined || gitHubPullRequest === null ) {
	console.log("Can't vote because trouble finding Github Pull request.")
      }
      console.log('arrive')
      mergeable = gitHubPullRequest.mergeable
      const baseBranch = gitHubPullRequest.base.ref
      const forkBranch = gitHubPullRequest.head.ref
      const head =  gitHubPullRequest.head.sha
      const remoteURL = gitHubPullRequest.head.repo.git_url
      const title = gitHubPullRequest.title
      console.log('baseBranch ', baseBranch)
      console.log('title ', title)
      if (mergeable === null) {
          mergeable = false
      }

      const res = await postCreatePullRequest(
        args.owner,
        `${args.owner}/${args.repo}`,
        args.defaultHash,
        args.childDefaultHash,
        head, // get head
        args.branchDefaultHash,
        remoteURL, // get remoteURl
        baseBranch, // get baseBranch
        forkBranch, // get forkBranch
        title // get title
      );
      console.log('res', res)
    }

      const resSetVote = await postSetVote(
        args.owner,
        `${args.owner}/${args.repo}`,
        args.defaultHash,
        args.childDefaultHash,
        mergeable,
        args.contributor_id,
        args.side
      );
   // Marginal vote that exceeded quorum, vote yes was majority.
    prVoteStatus = await postGetPullRequest(
      args.owner,
      args.repo,
      args.defaultHash,
      args.contributor_id,
      args.side
    );

    // Merge if turborsc pull request status says there are enough votes to merge.
    if (prVoteStatus.status === 200 && prVoteStatus.state === "merge") {
       console.log(`Github merge (${args.defaultHash}) disabled)`)
      /*resSetVote =*/ //await mergePullRequest(args.owner, args.repo, args.defaultHash)
    } 

    return resSetVote;
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
    const resTransferTokens =
        await postTransferTokens(
          "",
          `${args.owner}/${args.repo}`,
          args.from,
          args.to,
          args.amount,
        )

    return resTransferTokens
  },
  createUser: async (args) => {
    const resCreateUser =
        await postCreateUser(
          "",
	  "",
	  args.contributor_id,
	  args.contributor_name,
	  args.contributor_signature,
    args.token
        )

    // May need to implement in privateStore
    //database = setTSrepoHead(database, args, head)

    return resCreateUser;
  },
  getUser: async (args) => {
    const resgetUser = await getUser(args.contributor_id);
    return resgetUser;
  },
  getContributorName: async (args) => {
    // If not found, error is "There was an error: TypeError: Cannot read properties of null (reading 'contributor_name')"
    const resGetContributorName =
        await postGetContributorName(
          "",
	  "",
	  "",
	  args.contributor_id,
        )
  
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
    const resCreateRepo = await postCreateRepo(
      "",
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      args.contributor_id,
      args.side
      // args.head?
    );

    // May need to implement in privateStore
    //database = setTSrepoHead(database, args, head)

    return resCreateRepo;
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
};

module.exports = root;
