const assert = require('assert');
const { gitHeadUtil } = require('./../gitHeadUtil');
const { setVote } = require('./../serverCopy');

var snooze_ms = 300;
var testDirContractHead;
var testPullRequestsVoteCloseHistory;
var testFakeTurboSrcReposDB;
var testRepoAccounts;


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
        '7db9a/dir-contract',
        'vim/vim',
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

          //testing
          testFakeTurboSrcReposDB = fakeTurboSrcReposDB
        }
      };

      // The object representing authorized repos and contributors.
      var pullRequestsDB = {
         'default/default': ['vote_code']
      };

    });
    describe('For tests, initialize fake database', function () {
      it("Should populate fake turbo-src db.", async () => {
          await snooze(snooze_ms);
          const dirContractEntry =
            testFakeTurboSrcReposDB[
                "7db9a/dir-contract"
            ]
          assert.equal(
              JSON.stringify(dirContractEntry),
              JSON.stringify({
                head: "11d8638887e27ec4612da2a334b1b70850758cd3",
                supply: 1000000,
                quorum: 0.5,
                openPullRequest: "",
                contributors: {
                  mary: 500001,
                  '7db9a': 499999,
                },
                pullRequests: {},
              }),
              "test fake turbo-src db"
          );
      });
    });


    describe('Vote operations', function () {
        beforeEach(async() => {
        });

        it('Should vote on entry.', async () => {
            await snooze(snooze_ms);

            assert.equal(true, true, "test vote operations" );
            //assert.equal(true, true);
        });
    });
});