const assert = require('assert');
const { postSetVote,
  postGetPullRequest,
  postGetPRvoteYesTotals,
  postGetPRvoteNoTotals,
  postCreateRepo,
  postNewPullRequest,
  postClosePullRequest,
  postMergePullRequest
} = require('../../../src/utils/requests');
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Pull requests', function () {
  this.timeout(15000);
  // Increase mocha(testing framework) time, otherwise tests fails
  //before(async () => {
  //    await postCreateRepo(
  //        /*owner:*/ "vim",
  //        /*repo:*/ "vim",
  //        /*defaultHash:*/ "defaultHash4955",
  //        /*contributor_id:*/ "7db9a",
  //        /*side:*/ "yes",
  //    );
  //});
  describe.only('Close pull request.', function () {
    it('Should close pull request.', async () => {
      await snooze(1500);
      await postClosePullRequest(
        /*owner:*/ 'turbo-src',
        /*repo:*/ 'testrepo-white',
        /*defaultHash:*/ 'defaultHash1',
        /*contributor_id:*/ '7db9a',
        /*side:*/ 'yes'
      );
      assert.equal(
        true,
        false,
        'fail to close pull request'
      );

      //assert.equal(
      //    statusDuplicatePR,
      //    "closed",
      //    "Duplicate pull request."
      //);

    });
  });
});