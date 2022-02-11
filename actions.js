const root = {
  // Also a root 'methods' in graphql query, by the same name
  getPRvoteTotals: function (database, args) {
      const prID = args.pr_id.split('_')[1]

      const supply = database[args.owner + "/" + args.repo].supply
      const quorum = database[args.owner + "/" + args.repo].quorum

      const prFields = database[args.owner + "/" + args.repo].pullRequests[prID]

      var percentVotedQuorum

      if (prFields) {
        // Check if pull is halted
        // If no
        const totalVotedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens
        percentVotedQuorum = totalVotedTokens/supply
        c= totalVotedTokens/(supply*quorum)
      }

      return percentVotedQuorum
  },
  getPRvoteStatus: function(database, args) {
      const prID = args.pr_id.split('_')[1]

      const supply = database[args.owner + "/" + args.repo].supply
      const quorum = database[args.owner + "/" + args.repo].quorum

      const prFields = database[args.owner + "/" + args.repo].pullRequests[prID]

      if (prFields) {
        // Check if pull is halted
        // If no
        const totalVotedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens
        const percentVoted = totalVotedTokens/supply
        var status;
        if (percentVoted >= quorum) {
          status = 'closed'
        } else {
          status = 'open'
        }
      } else {
        status = 'none'
      }

      //client.set(`vs-${prID}`, status)
      console.log('198')
      console.log(database)

      return status
  },
  pullAndVoteStatus: async function(database, args) {
    const prID = (args.pr_id).split('_')[1]
    var votedAlready;

    const activePullRequests = database[args.owner + "/" + args.repo].pullRequests
    const numberActivePullRequests = Object.keys(activePullRequests).length

    if (numberActivePullRequests === 0) {
       database[args.owner + "/" + args.repo].openPullRequest = prID
    }

    const openPullRequest = database[args.owner + "/" + args.repo].openPullRequest

    const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]

    // We can only use the function if there asking for about a
    // specific pull request.
    console.log('owner ' + args.owner)
    console.log('repo ' + args.repo)
    console.log('pr_id ' + prID)
    console.log('tokens ' + tokens)

    const prVoteStatusNow = getPRvoteStatus(database, args)
    if (prVoteStatusNow === 'none') {
       votedAlready = false
    } else {
      const votedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens
      votedAlready = Object.keys(votedTokens).includes(args.contributor_id)
      console.log(args.contributor_id + ' voted already: ' + votedAlready)
    }

    const openPullRequestStatus = (openPullRequest === prID || openPullRequest === '');

    console.log('op pr status: ' + openPullRequestStatus)

    var [res, pullReqRepoHead] = await getPRhead(args)
    const alreadyHead = (pullReqRepoHead === database[args.owner + "/" + args.repo].head)

    console.log('pullReqHead')
    console.log(pullReqRepoHead)
    console.log(database[args.owner + "/" + args.repo].head)
    console.log(alreadyHead)

    console.log("s 391")
    console.log((prVoteStatusNow !== 'closed' && !votedAlready && openPullRequestStatus && !alreadyHead))

    const pullAndVoteStatus = (prVoteStatusNow !== 'closed' && !votedAlready && openPullRequestStatus && !alreadyHead)

    return pullAndVoteStatus
    //return {
    //         prVoteStatusNow: prVoteStatusNow,
    //         votedAlready: votedAlready,
    //         openPullRequestStatus: openPullRequestStatus,
    //         alreadyHead: alreadyHead
    //}

  },
  setVote: async function(database, args) {
    const prID = (args.pr_id).split('_')[1]
    const resultPullAndVoteStatus = await pullAndVoteStatus(database, args)

    //const resultVoteStatus = await voteStatus(database, standardArgs)
    //const prVoteStatusNow = resultVoteStatus.prVoteStatusNow
    //const votedAlready = resultVoteStatus.votedAlready
    //const openPullRequestStatus = resultVoteStatus.openPullRequestStatus
    //const alreadyHead = resultVoteStatus.alreadyHead

    const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]

    if (resultPullAndVoteStatus) {
      var pullRequest = pullRequestsDB[args.pr_id]
      if (typeof pullRequest === 'undefined') {
        const resNewPullRequest = newPullRequest(database, args);
        fakeTurboSrcReposDB = resNewPullRequest.db
      }
      const resUpdatePRvoteStatus = updatePRvoteStatus(fakeTurboSrcReposDB,args, tokens)
      fakeTurboSrcReposDB = resUpdatePRvoteStatus.db
      prVoteStatus =resUpdatePRvoteStatus.prVoteStatusUpdated

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
        if (prVoteStatus === 'closed') {
          [res,pullReqRepoHead] = await getPRhead(args)

          // Update HEAD to repo.
          database[args.owner + "/" + args.repo].head = pullReqRepoHead

          // Add to history
          pullRequestsVoteCloseHistory.push(prID)

          // Delete pull request from database
          delete database[args.owner + "/" + args.repo].pullRequests[prID]

          // Allow next pull request to be voted on.
          database[args.owner + "/" + args.repo].openPullRequest = ''
        }
      }
    }

    console.log('475')

    return {
             db: database,
             prVoteStatus: getPRvoteStatus(database, args)
    }
  },
  updatePRvoteStatus: async function(database, standardArgs, tokens) {
    const prID = standardArgs.pr_id.split('_')[1]
    const prVoteStatusNow = getPRvoteStatus(database, standardArgs)
    console.log(database)
    prVoteStatusUpdated = prVoteStatusNow

    if (prVoteStatusNow === 'open') {
      database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens.contributorID = {}
      database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id] = {
        tokens: 0,
        side: 'none'
      }

      console.log('upr 212')
      const totalVotedTokens = database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens

      //Add to vote tally. Creates pull request fields if needed.
      database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].totalVotedTokens = totalVotedTokens + tokens

      database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID].votedTokens[standardArgs.contributor_id].side = standardArgs.side

      prVoteStatusUpdated = getPRvoteStatus(database, standardArgs)

      database[standardArgs.owner + "/" + standardArgs.repo].pullRequests[prID]['pullRequestStatus'] = prVoteStatusUpdated

      console.log('upr 228')
    }

    // Maybe should have index increment to know if updated or not
    return {
             db: database,
             prVoteStatusUpdated : prVoteStatusUpdated
    }
  },
  newPullRequest: function(database, args) {
    const prID = args.pr_id.split('_')[1]

    const prVoteStatus = getPRvoteStatus(database, args)
    const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]
    const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side

    pullRequestsDB[args.pr_id] = [vote_code]

    console.log('npr 239')
    database[args.owner + "/" + args.repo].pullRequests[prID] = {}

    database[args.owner + "/" + args.repo].pullRequests[prID].pullRequestStatus = 'open'

    database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens = 0
    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens = {}
    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens.contributorID = {}
    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens[args.contributor_id] = {
      tokens: 0,
      side: 'none'
    }

    console.log('npr 247')

    return {
             prID: pullRequestsDB[args.pr_id],
             db: database
    }
  }
};

module.exports = root