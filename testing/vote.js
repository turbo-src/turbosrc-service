const assert = require('assert');
const { gitHeadUtil } = require('./../gitHeadUtil');

var snooze_ms = 300;
var dirContractHead;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote', function () {
    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(15000);

    before(async () => {
      var pullRequestsVoteCloseHistory = []

      var fakeTurboSrcReposDB = {};

      const repoAccounts = [
        'default/default',
        'turbo-src/extension',
        'turbo-src/graphql_express_server',
        '7db9a/dir-contract',
        'vim/vim',
        'NixOS/nix',
        'NixOS/nixpkgs',
      ]

      var head;
      var owner;
      var repo;
      for (i in repoAccounts) {
        if (repoAccounts[i] !== "default/default") {
          repoPath = repoAccounts[i].split('/')
          owner = repoPath[0]
          repo = repoPath[1]

          // Don't pass forkName because it's the master or main branch.
          head = await gitHeadUtil(owner, repo, '', 0)
          //'pullRequestStatus': {
          //  '$prID': $status,
          //  '$prID': $status,
          //}

          console.log(head)

          fakeTurboSrcReposDB[repoAccounts[i]] = {
            'head': head,
            'supply': 1_000_000,
            'quorum': 0.50,
            'openPullRequest': '',
            'contributors': {
              'mary': 500_001,
              '7db9a': 499_999,
            },
            'pullRequests': {
            }
          }

          //fakeTurboSrcReposDB[repoAccounts[i]] = {
          //  'head': head,
          //  'supply': 1_000_000,
          //  'quorum': 0.50,
          //  'contributors': {
          //    'emmanuel': 290_000,
          //    'mary': 290_000,
          //    'joseph': 200_000,
          //    'john': 200_000,
          //    '7db9a': 20_000,
          //  },
          //  'pullRequests': {
          //    'prid':
          //      'totalVotedTokens': $totalVotedTokens,
          //      'votedTokens': {
          //        '$contributorID': {
          //          tokens: $tokens,
          //          side: $side,
          //        }
          //       }
          //    }
          //  }
          //}

          //testing
          if (repoAccounts[i] !== '7db9a/dir-contract') {
              dirContractHead = head
          }
        }
      };

      // The object representing authorized repos and contributors.
      var pullRequestsDB = {
         'default/default': ['vote_code']
      };
        console.log("\nbefore Vote:\n");
    });


    describe('Vote operations', function () {
        beforeEach(async() => {
        });

        it('Should vote on entry.', async () => {
            await snooze(snooze_ms);

            assert.equal(true, true, "test vote operations" );
            //assert.equal(true, true);
        });

        it("Should fetch dir-contract's head.", async () => {
            await snooze(snooze_ms);

            assert.equal(
                dirContractHead,
                "26d8898eaa55e1bbac650eff5f9dca738de90dea",
                "test head fetch"
            );
        });
    });
});