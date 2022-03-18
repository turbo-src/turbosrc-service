// state

const root = {
  createRepo: function (database, pullRequestsDB, args) {
    database[args.owner + "/" + args.repo].quorum = 0.50

    return {
             pullRequestsDB: pullRequestsDB,
             db: database,
    }
  },
  createTokenSupply: function (database, tokens, args) {
    const prID = args.pr_id.split('_')[1]

    database[args.owner + "/" + args.repo].tokenSupply = tokens

    return  database
  },
  setQuorum: function (database, quorum, args) {
    const prID = args.pr_id.split('_')[1]

    database[args.owner + "/" + args.repo].quorum = quorum

    return  database
  },
  newPullRequest: function (database, pullRequestsDB, args, prVoteStatus) {
    const prID = args.pr_id.split('_')[1]

    const tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]
    const vote_code = prVoteStatus + "%" + args.repo + "%" + args.contributor_id + "%" + tokens + "%" + args.side

    pullRequestsDB[args.pr_id] = [vote_code]

    database[args.owner + "/" + args.repo].pullRequests[prID] = {}

    database[args.owner + "/" + args.repo].pullRequests[prID].pullRequestStatus = 'open'

    database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens = 0
    database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedYesTokens = 0
    database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedNoTokens = 0
    database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens = {}

    return {
             pullRequestsDB: pullRequestsDB,
             db: database,
    }
  },

}

module.exports = root