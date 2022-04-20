const { getPRhead } = require('./pullForkUtil');
const {
  getPullRequest,
  mergePullRequest,
  closePullRequest
 } = require('./gitHubUtil');
const { gitHeadUtil } = require('./gitHeadUtil');
const { createRepo,
        createTokenSupply,
        setQuorum,
        newPullRequest,
        setContributorVotedTokens,
        getContributorTokens,
        getTSpullRequest,
        deleteTSpullRequest,
        getContributorVotedTokens,
        getAllVotedTokens,
        getQuorum,
        getTokenSupply,
        getTotalVotedTokens,
        getTotalVotedYesTokens,
        getTotalVotedNoTokens
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
  getPRvoteStatus: function(database, args) {
      const prID = args.pr_id.split('_')[1]

      const tsPullRequest = getTSpullRequest(database, args)

      if (tsPullRequest) {
        // Check if pull is halted
        // If no
        const supply = database[args.owner + "/" + args.repo].tokenSupply
        const quorum = database[args.owner + "/" + args.repo].quorum

        const totalVotedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens
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

    const activePullRequests = database[args.owner + "/" + args.repo].pullRequests
    const numberActivePullRequests = Object.keys(activePullRequests).length

    //Fix: shouldn't make state changes in status check.
    if (numberActivePullRequests === 0) {
       database[args.owner + "/" + args.repo].openPullRequest = prID
    }

    const openPullRequest = database[args.owner + "/" + args.repo].openPullRequest

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

    const alreadyHead = (pullReqRepoHead === database[args.owner + "/" + args.repo].head)

    console.log('pullReqHead')
    console.log(pullReqRepoHead)
    console.log(database[args.owner + "/" + args.repo].head)
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
  setVote: async function(database, pullRequestsDB, pullRequestsVoteCloseHistory, pullRequestVoteMergeHistory, args) {
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
      var pullRequest = pullRequestsDB[args.pr_id]
      console.log('130')
      if (typeof pullRequest === 'undefined') {
         //return some error
      }

      //database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens.contributorID = {}
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
          database[args.owner + "/" + args.repo].head = pullReqRepoHead

          // Delete pull request from database
          database = deleteTSpullRequest(database, args)
          // Allow next pull request to be voted on.
          database[args.owner + "/" + args.repo].openPullRequest = ''
          if (prVoteStatus === 'merge') {
            // Add to history
            pullRequestVoteMergeHistory.push(prID)

            await mergePullRequest(args.owner, args.repo, prID)
          } else if (prVoteStatus === 'closed') {
            // Add to history
            pullRequestsVoteCloseHistory.push(prID)

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
      database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens.contributorID = {}
      database = setContributorVotedTokens(database, args, tokens, args.side)

      console.log('upr 212')
      const totalVotedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens

      const totalVotedYesTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedYesTokens
      const totalVotedNoTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedNoTokens

      //Add to vote tally. Creates pull request fields if needed.
      database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens = totalVotedTokens + tokens

      database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens[args.contributor_id].side = args.side

      //Add yes and not votes to tally.
      database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens = totalVotedTokens + tokens
      if (args.side === "yes") {
        database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedYesTokens = totalVotedYesTokens + tokens
      } else {
        database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedNoTokens = totalVotedNoTokens + tokens
      }

      prVoteStatusUpdated = module.exports.getPRvoteStatus(database, args)

      database[args.owner + "/" + args.repo].pullRequests[prID]['pullRequestStatus'] = prVoteStatusUpdated

      console.log('upr 228')
    }

    // Maybe should have index increment to know if updated or not
    return {
             db: database,
             prVoteStatusUpdated: prVoteStatusUpdated
    }
  },
  createRepo: async (database, pullRequestsDB, args) => {
    const resCreateRepo = await createRepo(database, pullRequestsDB, args)
    database = resCreateRepo.db
    // Add tip of OID to repo db.
    const head = await gitHeadUtil(args.owner, args.repo, '', 0)
    database[args.owner + "/" + args.repo].head = head

    pullRequestsDB = resCreateRepo.pullRequestsDB
    database = createTokenSupply(database, 1_000_000, args)
    database = setQuorum(database, 0.50, args)

    return {
             pullRequestsDB: pullRequestsDB,
             db: database
    }
  },
  newPullRequest: function(database, pullRequestsDB, args) {
    const prVoteStatus = module.exports.getPRvoteStatus(database, args)

    const resNewPullRequest = newPullRequest(database, pullRequestsDB, args, prVoteStatus)
    database = resNewPullRequest.db
    pullRequestsDB = resNewPullRequest.pullRequestsDB

    return {
             pullRequestsDB: pullRequestsDB,
             db: database
    }
  }
};

module.exports = root