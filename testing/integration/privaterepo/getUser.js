const assert = require('assert');
const fsPromises = require('fs').promises;
const {
  getUser
} = require('../../../src/utils/requests');

const { Parser } = require('graphql/language/parser');

const {
  getContributorAddress,
  getGithubContributor
} = require('../../../src/utils/config');
const {
  getGithubToken
} = require('../../../src/utils/gitHubUtil.js');


var snooze_ms = 5000;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Get users', function () {
  this.timeout(snooze_ms*24);
  // Increase mocha(testing framework) time, otherwise tests fails
  it(`Should show that a user exists`, async () => {
    // tester a
    assert.deepEqual(
      await getUser(
        /*contributor_id:*/ '0x09D56A39599Dd81e213EB2A9Bd6785945B662662'
      ),
      {
        status: "success",
        message: "User retrieved successfully",
        info: {
          contributor_id: "0x09D56A39599Dd81e213EB2A9Bd6785945B662662",
          contributor_name: "tsrctester1"
        }
      }
    )

    // tester b
    assert.deepEqual(
      await getUser(
        /*contributor_id:*/ '0xafC193df9bB3d6d6062029b3E67243C00C17d534'
      ),
      {
        status: "success",
        message: "User retrieved successfully",
        info: {
          contributor_id: "0xafC193df9bB3d6d6062029b3E67243C00C17d534",
          contributor_name: "tsrctester2"
        }
      }
    )
  });
  describe(`User doesn't already exists.`, function () {
    it(`Should throw an error on getUser because the users doesn't exists`, async () => {

      // tester a
      assert.deepEqual(
        await getUser(
          /*contributor_id:*/ '0x0000000000000000000000000000000000000000'
        ),
        {
          status: "error",
          message: "Error retrieving user: TypeError: Cannot read properties of null (reading 'contributor_id')",
          info: {
            contributor_id: null,
            contributor_name: null
          }
        }
      )

      // tester b
      assert.deepEqual(
        await getUser(
          /*contributor_id:*/ '0x0000000000000000000000000000000000000001'
        ),
        {
          status: "error",
          message: "Error retrieving user: TypeError: Cannot read properties of null (reading 'contributor_id')",
          info: {
            contributor_id: null,
            contributor_name: null
          }
        }
      )

    });
  });
});
