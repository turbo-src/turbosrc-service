const { getPRhead } = require('./utils/pullForkUtil');
const {
  getPullRequest,
  mergePullRequest,
  closePullRequest
 } = require('./utils/gitHubUtil');
const { gitHeadUtil } = require('./utils/gitHeadUtil');
const {
        postCreateRepoTestDB,
        postCreateTokenSupplyTestDB,
        postSetTSrepoHeadTestDB,
        postSetQuorumTestDB,
        postNewPullRequestTestDB,
        postSetContributorVotedTokensTestDB,
        postAddToTotalVotedYesTokensDB,
      } = require('./utils/requests')
const { createRepo,
        createTokenSupply,
        transferTokens,
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
        setVoteSide,
        getOpenPullRequest,
        setOpenPullRequest,
        setTSrepoHead,
        getTSrepoHead,
        setPullRequestStatus,
        addToMergePullRequestHistory,
        addToRejectPullRequestHistory,
        getPullRequestFromHistory,
        getRepoStatus,
        checkContributor,
        checkMergePullRequestHistory,
        checkRejectPullRequestHistory,
        getContributorTokenAmount
 } = require('./state');

const root = {
  // Also a root 'methods' in graphql query, by the same name
  getPRvote: function (database, args) {
    const prID = args.pr_id.split('_')[1]

    const tsPullRequest = getTSpullRequest(database, args)

    if (typeof tsPullRequest === 'undefined') {
      return undefined
    } else {
      const votedTokens = getContributorVotedTokens(database, args)
      return votedTokens
    }
  },
  getPRvoteTotals: function (database, args) {
      const prID = args.pr_id.split('_')[1]
      //This is a little weird because it should
      //Already have a value but leaving here just
      // in case. It will get resolved below.
      var totalVotedTokens = 0;
      var totalVotedYesTokens = 0;
      var totalVotedNoTokens = 0;

      const tsPullRequest = getTSpullRequest(database, args)

      var percentVotedQuorum

      if (tsPullRequest) {
        // Check if pull is halted
        // If no

        const supply = getTokenSupply(database, args)
        const quorum = getQuorum(database, args)

        totalVotedTokens = getTotalVotedTokens(database, args)

        totalVotedYesTokens = getTotalVotedYesTokens(database, args)

        totalVotedNoTokens = getTotalVotedNoTokens(database, args)

        percentVotedQuorum = totalVotedTokens/supply
        c= totalVotedTokens/(supply*quorum)
      } else {
        "none"
      }

      return {
        percentVotedQuorum: percentVotedQuorum,
        totalVotedTokens: totalVotedTokens,
        totalVotedYesTokens: totalVotedYesTokens,
        totalVotedNoTokens: totalVotedNoTokens
      }
  },
  getContributorTokenAmount: function(database, args) {
    const contributorTokenAmount = getContributorTokenAmount(database, args)

    return contributorTokenAmount
  },
  getPRvoteStatus: function(database, args) {
      const prID = args.pr_id.split('_')[1]

      const tsPullRequest = getTSpullRequest(database, args)

      if (tsPullRequest) {
        // Check if pull is halted
        // If no
        const supply = getTokenSupply(database, args)
        const quorum = getQuorum(database, args)

        const totalVotedTokens = getTotalVotedTokens(database, args)
        const percentVoted = totalVotedTokens/supply
        var status;
        if (percentVoted >= quorum) {
          const voteTotals = module.exports.getPRvoteTotals(database, args)
          const yesRatio = voteTotals.totalVotedYesTokens / voteTotals.totalVotedNoTokens
          if (yesRatio > 1) {
            status = 'merge'
          } else {
            status = 'closed'
          }
        } else {
          status = 'open'
        }
      } else {
        status = 'none'
      }

      //client.set(`vs-${prID}`, status)
      console.log('198')
      console.log(status)
      console.log(database)

      return status
  },
  pullAndVoteStatus: async function(database, pullReqRepoHead, args) {
    const prID = (args.pr_id).split('_')[1]
    var votedAlready;

    const activePullRequests = getAllTSpullRequests(database, args)
    const numberActivePullRequests = Object.keys(activePullRequests).length

    //Fix: shouldn't make state changes in status check.
    if (numberActivePullRequests === 0) {
       database = setOpenPullRequest(database, args, prID)
    }
    const openPullRequest = getOpenPullRequest(database,args)

    const tokens = getContributorTokens(database, args)

    // We can only use the function if there asking for about a
    // specific pull request.
    console.log('owner ' + args.owner)
    console.log('repo ' + args.repo)
    console.log('pr_id ' + prID)
    console.log('tokens ' + tokens)

    const prVoteStatusNow = module.exports.getPRvoteStatus(database, args)
    if (prVoteStatusNow === 'none') {
       votedAlready = false
    } else {
      const allVotedTokens = getAllVotedTokens(database, args)
      votedAlready = Object.keys(allVotedTokens).includes(args.contributor_id)
      console.log(args.contributor_id + ' voted already: ' + votedAlready)
    }

    const openPullRequestStatus = (openPullRequest === prID || openPullRequest === '');

    console.log('op pr status: ' + openPullRequestStatus)

    const alreadyHead = (pullReqRepoHead === getTSrepoHead(database, args))

    console.log('pullReqHead')
    console.log(pullReqRepoHead)
    console.log(getTSrepoHead(database, args))
    console.log(alreadyHead)

    console.log("s 391")
    const closedMerge = (prVoteStatusNow === 'closed' || prVoteStatusNow === 'merge')
    console.log((!closedMerge && !votedAlready && openPullRequestStatus && !alreadyHead))

    const pullAndVoteStatus = (!closedMerge && !votedAlready && openPullRequestStatus && !alreadyHead)

    return {
      pullAndVoteStatus: pullAndVoteStatus,
      db: database
    }
    //return {
    //         prVoteStatusNow: prVoteStatusNow,
    //         votedAlready: votedAlready,
    //         openPullRequestStatus: openPullRequestStatus,
    //         alreadyHead: alreadyHead
    //}

  },
  setVote: async function(database, pullRequestsDB, pullRequestVoteCloseHistory, pullRequestVoteMergeHistory, args) {
    const prID = (args.pr_id).split('_')[1]
    var [_res, pullReqRepoHead] = await getPRhead(args)
    const resultPullAndVoteStatus = await module.exports.pullAndVoteStatus(database, pullReqRepoHead, args)
    database = resultPullAndVoteStatus.db
    //other function

    //const resultVoteStatus = await voteStatus(database, standardArgs)
    //const prVoteStatusNow = resultVoteStatus.prVoteStatusNow
    //const votedAlready = resultVoteStatus.votedAlready
    //const openPullRequestStatus = resultVoteStatus.openPullRequestStatus
    //const alreadyHead = resultVoteStatus.alreadyHead

    if (resultPullAndVoteStatus.pullAndVoteStatus) {
      console.log('128')
      const tokens = getContributorTokens(database, args)
      var pullRequest = getPullRequestFromHistory(pullRequestsDB, args)
      console.log('130')
      if (typeof pullRequest === 'undefined') {
         //return some error
      }

      //database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens.contributorID = {}

      await postSetContributorVotedTokensTestDB(
        args.owner,
        args.repo,
        args.pr_id,
        args.contributor_id,
        "none",
        0
      )

      //To be deprecated for above.
      database = setContributorVotedTokens(database, args, 0, "none")

      const resUpdatePRvoteStatus = await module.exports.updatePRvoteStatus(database,args, tokens)
      database = resUpdatePRvoteStatus.db
      const prVoteStatus = resUpdatePRvoteStatus.prVoteStatusUpdated

      console.log('408')
      console.log(prVoteStatus)
      console.log(database)
      // Add tokens to vote tally so we can get the new
      // pull request vote status.
      // Vote data to sent over the wire.
      //const prVoteStatus = getPRvoteStatus(args);

      var baseRepoName = args.repo
      var baseRepoOwner = args.owner
      const resGetPR = await getPullRequest(baseRepoOwner,baseRepoName, prID);
      var pullReqRepoHead = await gitHeadUtil(resGetPR.contributor, baseRepoName,resGetPR.forkBranch, 0);
      const baseDir = 'repos/' + args.repo;
      //const pullForkDir = baseDir + '/' + pullReqRepoHead;

      console.log('pullReqRepoHead ' + pullReqRepoHead);

      //console.log('\nvote code:\n' + vote_code)

      ////If pull request doesn't exist, we have to make one to set a vote.
      if (resGetPR !== 404 && pullReqRepoHead !== 404) {
        const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side
        // If vote close it out, open it up for other PRs.

        const closedMerge = (prVoteStatus === 'closed' || prVoteStatus === 'merge')
        if (closedMerge) {
          [_res,pullReqRepoHead] = await getPRhead(args)

          // Update HEAD to repo.
          await postSetTSrepoHeadTestDB(
            args.owner,
            args.repo,
            args.pr_id,
            args.contributor_id,
            args.side,
            pullReqRepoHead
          )

          //To be deprecated for above.
          database = setTSrepoHead(database, args, pullReqRepoHead)

          // Delete pull request from database
          database = deleteTSpullRequest(database, args)
          // Allow next pull request to be voted on.
          setOpenPullRequest(database, args, '')
          if (prVoteStatus === 'merge') {
            // Add to history
            pullRequestVoteMergeHistory = addToMergePullRequestHistory(pullRequestVoteMergeHistory, args)

            await mergePullRequest(args.owner, args.repo, prID)
          } else if (prVoteStatus === 'closed') {
            // Add to history
            pullRequestVoteCloseHistory = addToRejectPullRequestHistory(pullRequestVoteCloseHistory, args)

            await closePullRequest(args.owner, args.repo, prID)
          }
        }
      }
    }

    console.log('475')

    return {
             db: database,
             prVoteStatus: module.exports.getPRvoteStatus(database, args)
    }
  },
  updatePRvoteStatus: async function(database, args, tokens) {
    const prID = args.pr_id.split('_')[1]
    const prVoteStatusNow = module.exports.getPRvoteStatus(database, args)
    console.log(database)
    prVoteStatusUpdated = prVoteStatusNow

    if (prVoteStatusNow === 'open') {
      await postSetContributorVotedTokensTestDB(
        args.owner,
        args.repo,
        args.pr_id,
        args.contributor_id,
        args.side,
        tokens
      )

      //To be deprecated for above.
      database = setContributorVotedTokens(database, args, tokens, args.side)

      console.log('upr 212')

      database = setVoteSide(database, args)

      //Add yes and not votes to tally.
      database = addToTotalVotedTokens(database, args, tokens)
      if (args.side === "yes") {

        await postAddToTotalVotedYesTokensDB(
          args.owner,
          args.repo,
          args.pr_id,
          args.contributor_id,
          args.side,
          tokens
        )

        //To be deprecated for above.
        database = addToTotalVotedYesTokens(database, args, tokens)
      } else {
        database = addToTotalVotedNoTokens(database, args, tokens)
      }

      prVoteStatusUpdated = module.exports.getPRvoteStatus(database, args)

      database = setPullRequestStatus(database, args, prVoteStatusUpdated)

      console.log('upr 228')
    }

    // Maybe should have index increment to know if updated or not
    return {
             db: database,
             prVoteStatusUpdated: prVoteStatusUpdated
    }
  },
  transferTokens: async (database, pullRequestsDB, args) => {
    const restTransferTokens = await transferTokens(database, pullRequestsDB, args)
    database = restTransferTokens.db

    return {
             pullRequestsDB: pullRequestsDB,
             db: database
    }
  },
  createRepo: async (database, pullRequestsDB, args) => {
    debugger
    await postCreateRepoTestDB(
      args.owner,
      args.repo,
      args.pr_id,
      args.contributor_id,
      args.side
    )

    //To be deprecated for above.
    const resCreateRepo = await createRepo(database, pullRequestsDB, args)
    database = resCreateRepo.db

    // Add tip of OID to repo db.
    const head = await gitHeadUtil(args.owner, args.repo, '', 0)

    await postSetTSrepoHeadTestDB(
      args.owner,
      args.repo,
      args.pr_id,
      args.contributor_id,
      args.side,
      head
    )

    //To be deprecated for above.
    database = setTSrepoHead(database, args, head)

    pullRequestsDB = resCreateRepo.pullRequestsDB

    await postCreateTokenSupplyTestDB(
      args.owner,
      args.repo,
      args.pr_id,
      args.contributor_id,
      args.side,
      1_000_000
    )

    //To be deprecated for above.
    database = createTokenSupply(database, 1_000_000, args)

    await postSetQuorumTestDB(
      args.owner,
      args.repo,
      args.pr_id,
      args.contributor_id,
      args.side,
      0.50
    )

    //To be deprecated for above.
    database = setQuorum(database, 0.50, args)

    return {
             pullRequestsDB: pullRequestsDB,
             db: database
    }
  },
  newPullRequest: async (database, pullRequestsDB, args) => {
    const prVoteStatus = module.exports.getPRvoteStatus(database, args)

    const resNewPullRequest = newPullRequest(database, pullRequestsDB, args, prVoteStatus)

    await postNewPullRequestTestDB(
      args.owner,
      args.repo,
      args.pr_id,
      args.contributor_id,
      args.side,
      prVoteStatus
    )

    //To be deprecated for above.
    database = resNewPullRequest.db
    pullRequestsDB = resNewPullRequest.pullRequestsDB

    return {
             pullRequestsDB: pullRequestsDB,
             db: database
    }
  },
  getActivePullRequestsCount: function(database, args) {
    const activePullRequests = getAllTSpullRequests(database, args)
    const numberActivePullRequests = Object.keys(activePullRequests).length

    return numberActivePullRequests

  },
  getRepoStatus: function(database, args) {
    const status = getRepoStatus(database, args)

    return status
  },
  getContributors: function(database, args) {
    const status = getRepoStatus(database, args)

    return status
  },
  checkContributor: function(database, args) {
    const contributor_exists = checkContributor(database, args)

    return contributor_exists
  },
  checkMergePullRequestHistory: function(pullRequestVoteMergeHistory, args) {
    const status = checkMergePullRequestHistory(pullRequestVoteMergeHistory, args)

    return status
  },
  checkRejectPullRequestHistory: function(pullRequestVoteCloseHistory, args) {
    const status = checkRejectPullRequestHistory(pullRequestVoteCloseHistory, args)

    return status
  },
};

module.exports = root