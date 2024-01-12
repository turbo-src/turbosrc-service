const assert = require('assert');
const {
  postCreateUser,
  postGetContributorName,
  postGetContributorTokenAmount,
  postCreateRepo,
  postTransferTokens
} = require('../../../src/utils/requests');

const {
  getContributorAddress,
  getGithubUser
} = require('../../../src/utils/config');

const { Parser } = require('graphql/language/parser');

var snooze_ms = 5000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Create repo', function () {
  this.timeout(snooze_ms*12);
  // Increase mocha(testing framework) time, otherwise tests fails
  before(async () => {
  });
  describe.only('Get have new contributors', function () {
    it('Should get token amoutns of each user', async () => {
      const user = await getGithubUser();
      //const userAddr = await getContributorAddress()

      this.timeout(snooze_ms);
      await postCreateRepo(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ '',
        /*contributor:*/ 'mary',
        /*side:*/ ''
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ user,
        /*amount:*/ 33_999
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'am',
        /*amount:*/ 15_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'jc',
        /*amount:*/ 10_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'pc',
        /*amount:*/ 75_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'mb',
        /*amount:*/ 75_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'np',
        /*amount:*/ 5_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'nn',
        /*amount:*/ 100_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'jp',
        /*amount:*/ 50_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'ts',
        /*amount:*/ 50_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'af',
        /*amount:*/ 10_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'ds',
        /*amount:*/ 75_000
      );

      this.timeout(snooze_ms);
      await postTransferTokens(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*from:*/ 'mary',
        /*to:*/ 'ri',
        /*amount:*/ 1_000
      );

      const maryContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'mary',
        /*side:*/ 'no'
      );

      const maryContributorTokenAmount = Number(maryContributorTokenAmountRes);

      const contributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ user,
        /*side:*/ 'no'
      );

      const contributorTokenAmount = Number(contributorTokenAmountRes);

      const amContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'am',
        /*side:*/ 'no'
      );

      const amContributorTokenAmount = Number(amContributorTokenAmountRes);

      const jcContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'jc',
        /*side:*/ 'no'
      );

      const jcContributorTokenAmount = Number(jcContributorTokenAmountRes);

      const pcContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'pc',
        /*side:*/ 'no'
      );

      const pcContributorTokenAmount = Number(pcContributorTokenAmountRes);

      const mbContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'mb',
        /*side:*/ 'no'
      );

      const mbContributorTokenAmount = Number(mbContributorTokenAmountRes);

      const npContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'np',
        /*side:*/ 'no'
      );

      const npContributorTokenAmount = Number(npContributorTokenAmountRes);

      const nnContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'nn',
        /*side:*/ 'no'
      );

      const nnContributorTokenAmount = Number(nnContributorTokenAmountRes);

      const jpContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'jp',
        /*side:*/ 'no'
      );

      const jpContributorTokenAmount = Number(jpContributorTokenAmountRes);

      const tsContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'ts',
        /*side:*/ 'no'
      );

      const tsContributorTokenAmount = Number(tsContributorTokenAmountRes);

      const afContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'af',
        /*side:*/ 'no'
      );

      const afContributorTokenAmount = Number(afContributorTokenAmountRes);

      const dsContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'ds',
        /*side:*/ 'no'
      );

      const dsContributorTokenAmount = Number(dsContributorTokenAmountRes);

      const riContributorTokenAmountRes = await postGetContributorTokenAmount(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'ri',
        /*side:*/ 'no'
      );

      const riContributorTokenAmount = Number(riContributorTokenAmountRes);

      assert.equal(
        contributorTokenAmount,
        33_999,
        'Fail to get amount.'
      );

      assert.equal(
        amContributorTokenAmount,
        15_000,
        'Fail to get amount.'
      );

      assert.equal(
        jcContributorTokenAmount,
        10_000,
        'Fail to get amount.'
      );

      assert.equal(
        pcContributorTokenAmount,
        75_000,
        'Fail to get amount.'
      );

      assert.equal(
        mbContributorTokenAmount,
        75_000,
        'Fail to get amount.'
      );

      assert.equal(
        npContributorTokenAmount,
        5_000,
        'Fail to get amount.'
      );

      assert.equal(
        nnContributorTokenAmount,
        100_000,
        'Fail to get amount.'
      );

      assert.equal(
        jpContributorTokenAmount,
        50_000,
        'Fail to get amount.'
      );

      assert.equal(
        tsContributorTokenAmount,
        50_000,
        'Fail to get amount.'
      );

      assert.equal(
        afContributorTokenAmount,
        10_000,
        'Fail to get amount.'
      );

      assert.equal(
        dsContributorTokenAmount,
        75_000,
        'Fail to get amount.'
      );

      assert.equal(
        riContributorTokenAmount,
        1_000,
        'Fail to get amount.'
      );

      assert.equal(
        maryContributorTokenAmount,
        500_001,
        'Fail to get amount.'
      );
      const maryName = await postGetContributorName(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ 'mary'
      );
      this.timeout(snooze_ms*50);
      const userName = await postGetContributorName(
        /*owner:*/ user,
        /*repo:*/ 'demo',
        /*defaultHash:*/ 'defaultHash4',
        /*contributor:*/ user
      );

      assert.equal(
        maryName,
        'mary',
        'Fail to get contributors\'s name from namspace db by contributor id.'
      );
      assert.equal(
        userName,
        user,
        'Fail to get contributors\'s signature from namspace db by contibutor id.'
      );
    });
  });
});