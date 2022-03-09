// state

const root = {
  createRepo: function (database, pullRequestsDB, args, prVoteStatus) {
    const prID = args.pr_id.split('_')[1]


    const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]
    const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side

    pullRequestsDB[args.pr_id] = [vote_code]

    database[args.owner + "/" + args.repo].pullRequests[prID] = {}

    database[args.owner + "/" + args.repo].pullRequests[prID].pullRequestStatus = 'open'

    database[args.owner + "/" + args.repo].pullRequests[prID].tokenSupply = 1_000_000
    database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens = 0
    database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedYesTokens = 0
    database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedNoTokens = 0
    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens = {}
    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens.contributorID = {}
    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens[args.contributor_id] = {
      tokens: 0,
      side: 'none'
    }

    return {
             pullRequestsDB: pullRequestsDB,
             database,
    }
  },
  createTokenSupply: function (database, pullRequestsDB, args, prVoteStatus) {
  }

}

module.exports = root