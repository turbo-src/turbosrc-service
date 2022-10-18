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
  createLinkedPullRequest,
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
   console.log('issueID ', issueID)
    const gitHubPullRequest = await getGitHubPullRequest(owner, repo, issueID)

    const head = gitHubPullRequest.head.sha
    const mergeable = gitHubPullRequest.mergeable
    console.log('gHprHead', head)
    console.log('gHprMergeable', mergeable)
    return { head: head, mergeable: mergeable }
}

async function convertDefaultHash(owner, repo, defaultHash, write) {
    // When online it'll transform the defaultHash (e.g. issueID) into a tsrcID (e.g. PR commit head oid).
    // It'll also record the defaultHash against the tsrcID for later use.
   try {
    let resPostTsrcID
   let tsrcID = await postGetTsrcID(`${owner}/${repo}`, defaultHash)
   let mergeable = false
   let convertedChildDefaultHash
   let convertedDefaultHash
    console.log('tsrcID ', tsrcID)
    const onlineMode = await getTurbosrcMode()
    if (onlineMode === 'online') {
      console.log('args 100')
      console.log(owner)
      console.log(repo)
      console.log(defaultHash)
      const resGH = await getGitHubPRhead(owner, repo, defaultHash)
      const head = resGH.head
      mergeable = resGH.mergeable
      console.log('head ', head)
      console.log('mergeable ', mergeable)
      console.log('tsrcID 100', tsrcID)

      if (head === null || head === undefined ) {
        return { status: 500, mergeable: mergeable, defaultHash: defaultHash, childDefaultHash: defaultHash }
      } else if (tsrcID === head && tsrcID !== "500" ) {
        convertedDefaultHash = head
        convertedChildDefaultHash = head
        return { status: 201, mergeable: mergeable, defaultHash: convertedDefaultHash, childDefaultHash: convertedChildDefaultHash }
      } else if (tsrcID !== head && tsrcID !== "500" && tsrcID != null) {
	childDefaultHash = tsrcID
        convertedDefaultHash = tsrcID
        convertedChildDefaultHash = head
	console.log("Updated?")
	console.log("tsrcID/default ", convertedDefaultHash)
	console.log("child", convertedChildDefaultHash)
	
          return { status: 201, mergeable: mergeable, defaultHash: convertedDefaultHash, childDefaultHash: convertedChildDefaultHash }
      } else if (write) { 
        resPostTsrcID = await postCreateIssue(`${owner}/${repo}`, defaultHash, head)
        console.log('resPostTsrcID: ', resPostTsrcID)
        console.log(head)
        if (resPostTsrcID === "201") {
          console.log('resPostTsrcID: ', resPostTsrcID)
          convertedDefaultHash = head
          convertedChildDefaultHash = head
          return { status: 201, mergeable: mergeable, defaultHash: convertedDefaultHash, childDefaultHash: convertedChildDefaultHash }
        } else {
          console.log('defaultHash instead resPostTsrcID: ', defaultHash)
          convertedDefaultHash = defaultHash
          convertedChildDefaultHash = defaultHash
        return { status: 201, mergeable: mergeable, defaultHash: convertedDefaultHash, childDefaultHash: convertedChildDefaultHash }
        }
      } else {
        return { status: 500, mergeable: mergeable, defaultHash: defaultHash, childDefaultHash: defaultHash }
      }

    } else {
      if (tsrcID === head && tsrcID !== "500") {
        resPostTsrcID = tsrcID
      } else if (write) { 
	// Offline so we don't get the HEAD of the PR from GH.
        resPostTsrcID = await postCreateIssue(`${owner}/${repo}`, defaultHash, defaultHash)
      } else {
        return { status: 500, mergeable: mergeable, defaultHash: defaultHash, childDefaultHash: defaultHash }
      }
      if (resPostTsrcID === 201) {
        convertedDefaultHash = defaultHash
        convertedChildDefaultHash = defaultHash
        return { status: 201, mergeable: mergeable, defaultHash: convertedDefaultHash, childDefaultHash:convertedChildDefaultHash }
      } else {
        return { status: 500, mergeable: mergeable, defaultHash: defaultHash, childDefaultHash: defaultHash }
      }
    }

    convertedDefaultHash = defaultHash
    convertedChildDefaultHash = defaultHash
    return { status: 201, mergeable: mergeable, defaultHash: convertedDefaultHash, childDefaultHash:convertedChildDefaultHash }
    } catch(error) {
        return { status: 500, mergeable: mergeable, defaultHash: defaultHash, childDefaultHash: defaultHash }
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
    const convertedHashes = await convertDefaultHash(args.owner, args.repo, args.defaultHash, false)
    if (convertedHashes.status === 201) {
      args.defaultHash = convertedHashes.defaultHash
      args.childDefaultHash = convertedHashes.childDefaultHash
    }

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
    const convertedHashes = await convertDefaultHash(args.owner, args.repo, args.defaultHash, false)
    if (convertedHashes.status === 201) {
      args.defaultHash = convertedHashes.defaultHash
      args.childDefaultHash = convertedHashes.childDefaultHash
    }
    const voteNo = await postGetPRvoteNoTotals(
      args.owner,
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      args.contributor_id,
      ""
    );

    return voteNo;
  },
  getPRvoteTotals: async function (args) {
    const convertedHashes = await convertDefaultHash(args.owner, args.repo, args.defaultHash, false)
    if (convertedHashes.status === 201) {
      args.defaultHash = convertedHashes.defaultHash
      args.childDefaultHash = convertedHashes.childDefaultHash
    }
    const vote = await postGetPRvoteTotals(
      args.owner,
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      args.contributor_id,
      ""
    );

    return vote;
  },
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
    const convertedHashes = await convertDefaultHash(args.owner, args.repo, args.defaultHash, false)
    let mergeableCodeHost = true
    if (convertedHashes.status === 201) {
      args.defaultHash = convertedHashes.defaultHash
      args.childDefaultHash = convertedHashes.childDefaultHash
    }
    mergeableCodeHost = convertedHashes.mergeable
    let status = await postGetPullRequest(
      args.owner,
      `${args.owner}/${args.repo}`,
      args.defaultHash,
      "",
      ""
    );

    status.mergeableCodeHost = mergeableCodeHost
   
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
    console.log('defaultHash: ', args.defaultHash)
    console.log('childDefaultHash: ', args.childDefaultHash)
    convertedHashes = await convertDefaultHash(args.owner, args.repo, args.defaultHash, true)
    if (convertedHashes.status === 201) {
      args.defaultHash = convertedHashes.defaultHash
      args.childDefaultHash = convertedHashes.childDefaultHash

      //if (originalDefaultHash === args.childDefaultHash) {
      //  args.childDefaultHash = args.defaultHash
      //} else {
      //  args.childDefaultHash = await getGitHubPRhead(args.owner, args.repo, originalDefaultHash)
      //  args.childDefaultHash = await convertDefaultHash(args.owner, args.repo, args.childDefaultHash)
      //}

      console.log('after defaultHash: ', args.defaultHash)
      console.log('after childDefaultHash: ', args.childDefaultHash)

      console.log('args after')
      console.log(args)
      let mergeable
      let prVoteStatus = await postGetPullRequest(
        args.owner,
        `${args.owner}/${args.repo}`,
        args.defaultHash,
        args.contributor_id,
        args.side
      );
      console.log('prVoteStatus: ', prVoteStatus)

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

      if (prVoteStatus.status === 404) {
        // get github pull request to get below data
        // to pass into below arguments.
        
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
      } else if (args.defaultHash !== args.childDefaultHash && mergeable) {
         console.log('PR updated and is mergeable')

         const resLinkedPR = await createLinkedPullRequest(
           args.owner,
           `${args.owner}/${args.repo}`,
           /*parentDefaultHash:*/ args.defaultHash,
           /*defaultHash:*/ args.childDefaultHash,
           /*childDefaultHash:*/ args.childDefaultHash,
           /*head:*/ args.childDefaultHash,
           /*branchDefaultHash*/ "branchDefaultHash",
           remoteURL, // get remoteURl
           baseBranch, // get baseBranch
           forkBranch, // get forkBranch
           title // get title
         );

         if (resLinkedPR  === "201") {
            console.log('Created mergeable linked pr.')
            // New linked pr has default and child that's same as
            // the child of the parent.
            args.defaultHash = args.childDefaultHash
         } else {
           console.log("problem creating linked pull request")
           console.log(args.owner)
           console.log(`${args.owner}/${args.repo}`)
           console.log(/*parentDefaultHash:*/ args.defaultHash)
           console.log(/*defaultHash:*/ args.childDefaultHash)
           console.log(/*childDefaultHash:*/ args.childDefaultHash)
           console.log(/*head:*/ args.childDefaultHash)
           console.log(/*branchDefaultHash*/ "branchDefaultHash")
           console.log(remoteURL)// get remoteURL)
           console.log(baseBranch) // get baseBranch)
           console.log(forkBranch) // get forkBranch)
           console.log(title) // get title)
         }
      } else if (args.defaultHash !== args.childDefaultHash && !mergeable) {
         console.log('PR updated but is unmergeable')
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
        `${args.owner}/${args.repo}`,
        args.defaultHash,
        args.contributor_id,
        args.side
      );

      // Merge if turborsc pull request status says there are enough votes to merge.
      if (prVoteStatus.status === 200 && prVoteStatus.state === "merge") {
         console.log(`Github merge (${args.defaultHash}) disabled)`)
        /*resSetVote =*/ //await mergePullRequest(args.owner, args.repo, Number(issueId))
      } 

      return resSetVote;
    } else {
      return 403
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
