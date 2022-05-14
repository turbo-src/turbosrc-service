const assert = require('assert');
const {
        postCreateRepo,
        postCreatePullRequest,
        postSetVote,
        postGetPRvoteStatus,
        postNewPullRequest
      } = require('../../graphQLrequests')
const { Parser } = require('graphql/language/parser');
const fsPromises = require('fs').promises;

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function readDBfile(file) {
    const data = await fsPromises.readFile(file)
                       .catch((err) => console.error('Failed to read file', err));

    return data
}

describe('Make sure new database matches old.', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Check that db server and deprecated server output is the same.', function () {
      it("Should have the same database after creating a new ull request", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-new-pull-request.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-new-pull-request.json')

        assert.equal(
            testDBdata.toString(),
            deprecatedDBdata.toString()
        )
      });
      it("Should have the same database after creating a setting contributor's voted tokens", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-set-contributor-voted-tokens.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-set-contributor-voted-tokens.json')

        assert.equal(
            JSON.parse(testDBdata)["turbo-src/testrepo"]["pullRequests"]["1"]["votedTokens"].toString(),
            JSON.parse(deprecatedDBdata)["turbo-src/testrepo"]["pullRequests"]["1"]["votedTokens"].toString()
        )

        //assert.equal(
        //    testDBdata,
        //    deprecatedDBdata
        //)
      });
      it("Should have the same database after setting head commit", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-set-ts-repo-head.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-set-ts-repo-head.json')

        assert.equal(
            JSON.parse(testDBdata)["turbo-src/testrepo"]["head"].toString(),
            JSON.parse(deprecatedDBdata)["turbo-src/testrepo"]["head"].toString()
        )
      });
      it("Should have the same database after adding total yes votes", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-set-ts-repo-head.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-set-ts-repo-head.json')

        assert.equal(
            JSON.parse(testDBdata)["turbo-src/testrepo"]["pullRequests"]["1"]["totalVotedYesTokens"].toString(),
            JSON.parse(deprecatedDBdata)["turbo-src/testrepo"]["pullRequests"]["1"]["totalVotedYesTokens"].toString()
        )

        //assert.equal(
        //    testDBdata.toString(),
        //    deprecatedDBdata.toString()
        //)
      });
    });
});