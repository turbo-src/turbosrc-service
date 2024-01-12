const assert = require('assert');
const fsPromises = require('fs').promises;
const { postSetVote,
  postGetPullRequest,
  postGetPRvoteYesTotals,
  postGetPRvoteNoTotals,
  postGetContributorID,
  getNameSpaceRepo
} = require('../../../src/utils/requests');
const { Parser } = require('graphql/language/parser');
const {
  getGithubContributor
} = require('../../../src/utils/config');
const {
  getGithubToken
} = require('../../../src/utils/gitHubUtil.js');
const {socket} = require('../../../socketConfig');

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote.', function () {
  this.timeout(snooze_ms*12);
  // Increase mocha(testing framework) time, otherwise tests fails
  before(async () => {
    const contributor_name = await getGithubContributor();
    const contributor_token = await getGithubToken();

    const constributor_id = await postGetContributorID(
      /*owner:*/ contributor_name,
      /*repo:*/ 'demo',
      /*defaultHash:*/ 'issue_5',
      /*contributor_name:*/ contributor_name
    );

    await snooze(snooze_ms);

    const { repoID } = await getNameSpaceRepo(`${contributor_name}/demo`);

    await postSetVote(
      /*owner:*/ contributor_name,
      /*repo: */ repoID,
      /*defaultHash:*/ 'issue_5',
      /*childDefaultHash:*/ 'issue_5',
      /*mergeable:*/ true,
      /*contributor_id:*/ constributor_id,
      /*side:*/ 'no',
      /*token:*/ contributor_token
    );
    socket.emit('vote cast', contributor_name, repoID, 'issue_5');
    socket.disconnect();

  });
  describe.only('A single majority voter votes.', function () {
    it('Should close vote and then merge.', async () => {
      const contributor_name = await getGithubContributor();
      const contributor_id = await postGetContributorID(
        /*owner:*/ contributor_name,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'issue_5',
        /*contributor_name:*/ contributor_name
      );
      const { repoID } = await getNameSpaceRepo(`${contributor_name}/demo`);

      await snooze(snooze_ms);

      const mergeStatus = await postGetPullRequest(
        /*owner:*/ contributor_name,
        /*repo: */ repoID,
        /*defaultHash:*/ 'issue_5',
        /*contributor_id:*/ contributor_id,
        /*side:*/ 'yes'
      );
      await snooze(snooze_ms);
      const voteYesTotals = await postGetPRvoteYesTotals(
        /*owner:*/ contributor_name,
        /*repo: */ repoID,
        /*defaultHash:*/ 'issue_5',
        /*contributor_id:*/ contributor_id,
        /*side:*/ 'yes'
      );
      await snooze(snooze_ms);
      const voteNoTotals = await postGetPRvoteNoTotals(
        /*owner:*/ contributor_name,
        /*repo: */ repoID,
        /*defaultHash:*/ 'issue_5',
        /*contributor_id:*/ contributor_id,
        /*side:*/ 'yes'
      );

      assert.deepEqual(
        mergeStatus,
        { status: 200, state: 'close', 'mergeableCodeHost': true, repo_id: repoID,  fork_branch: 'pullRequest5', 'childDefaultHash': '3baa5aec09d458cd1cd935ab144ef7f68462cd71', 'defaultHash': '3baa5aec09d458cd1cd935ab144ef7f68462cd71' },
        'Fail to close even though it was voted out.'
      );

      assert.equal(
        voteYesTotals,
        '325000',
        'Fail to add votes yes.'
      );
      assert.equal(
        voteNoTotals,
        '674998',
        'Fail to zero out voteNoTotals after vote close.'
      );
    });
  });
});
