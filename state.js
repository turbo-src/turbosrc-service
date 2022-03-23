const { gitHeadUtil } = require('./gitHeadUtil');

const root = {
  createRepo: function (database, prDB, args) {
      const pullRequestsDB = prDB
      var head
      repoName = "vim/vim"
      repoPath = repoName.split('/')
      owner = repoPath[0]
      repo = repoPath[1]
      // Don't pass forkName because it's the master or main branch.
      //(async () => {
      //  head = await gitHeadUtil(owner, repo, '', 0)
      //  //'pullRequestStatus': {
      //  //  '$prID': $status,
      //  //  '$prID': $status,
      //  //}
      //});

      database[repoName] = {
        'head': 'c20e46a4e3efcd408ef132872238144ea34f7ae5',
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

}

module.exports = root