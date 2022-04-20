const root = {
  createRepo: async (database, prDB, args) => {
      const pullRequestsDB = prDB

      database[args.owner + "/" + args.repo] = {
        //'head': head,//'c20e46a4e3efcd408ef132872238144ea34f7ae5',
        'tokenSupply': 1_000_000,
        'openPullRequest': '',
        'contributors': {
          'mary': 500_001,
          '7db9a': 33_999,
          'am': 15_000,
          'jc': 10_000,
          'pc': 75_000,
          'mb': 75_000,
          'np': 5_000,
          'nn': 100_000,
          'jp': 50_000,
          'ts': 50_000,
          'af': 10_000,
          'ds': 75_000,
          'ri': 1_000
        },
        'pullRequests': {
        }
      }

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
  getContributorTokens: function(database, args) {
    tokens = database[args.owner + "/" + args.repo].contributors[args.contributor_id]

    return tokens
  },
  setContributorVotedTokens: function (database, args, tokens, side) {
   const prID = (args.pr_id).split('_')[1]

   database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens[args.contributor_id] = {
     tokens: tokens,
     side: side
   }

   return database
  },
  getTSpullRequest: function(database, args) {
    const prID = (args.pr_id).split('_')[1]
    const pullRequest = database[args.owner + "/" + args.repo].pullRequests[prID]

    return pullRequest
  },
  deleteTSpullRequest: function(database, args) {
    const prID = (args.pr_id).split('_')[1]

    delete database[args.owner + "/" + args.repo].pullRequests[prID]

    return database
  },
  getContributorVotedTokens: function(database, args) {
    const prID = (args.pr_id).split('_')[1]

    const votedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens[args.contributor_id]

    return votedTokens
  },
  getAllVotedTokens: function(database, args) {
    const prID = (args.pr_id).split('_')[1]

    const allVotedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].votedTokens

    return allVotedTokens
  },
  getTokenSupply: function(database, args) {
    const supply = database[args.owner + "/" + args.repo].tokenSupply

    return supply
  },
  getQuorum: function(database, args) {
    const quorum = database[args.owner + "/" + args.repo].quorum

    return quorum
  },
  getTotalVotedTokens: function(database, args) {
    const prID = (args.pr_id).split('_')[1]

    const totalVotedTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedTokens

    return totalVotedTokens
  },
  getTotalVotedYesTokens: function(database, args) {
    const prID = (args.pr_id).split('_')[1]

    const totalVotedYesTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedYesTokens

    return totalVotedYesTokens
  },
  getTotalVotedNoTokens: function(database, args) {
    const prID = (args.pr_id).split('_')[1]

    const totalVotedNoTokens = database[args.owner + "/" + args.repo].pullRequests[prID].totalVotedNoTokens

    return totalVotedNoTokens
  },
}

module.exports = root