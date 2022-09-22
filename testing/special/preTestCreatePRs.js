const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postCreateRepo,
        postCreatePullRequest,
        postSetVote,
        postGetPullRequest,
        postNewPullRequest
      } = require('../../src/utils/requests')
const { Parser } = require('graphql/language/parser');

var snooze_ms = 1500;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function readDBfile(file) {
    const data = await fsPromises.readFile(file)
                       .catch((err) => console.error('Failed to read file', err));

    return data
}

async function getGithubUser() {
    const data = await fsPromises.readFile('.config.json')
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let user = json.github.user
    if (user === undefined) {
      throw new Error("Failed to load Github user " + user);

    } else {
      console.log("Successfully read Github " + user);
    }

    return user

}

describe('Create repo and GH pull request', function () {
    this.timeout(snooze_ms*12);
    // Increase mocha(testing framework) time, otherwise tests fails
    before(async () => {
    });
    describe.only('Check that db server and deprecated server output is the same.', function () {
      it("Should have the same database after creating repo", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-create-repo.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-create-repo.json')

        assert.equal(
            testDBdata.toString(),
            deprecatedDBdata.toString()
        )
      });
      it("Should have the same database after creating token supply", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-set-ts-repo-head.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-create-token-supply.json')

        assert.equal(
            testDBdata.toString(),
            deprecatedDBdata.toString()
        )
      });
      it("Should have the same database after setting head commit", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-set-ts-repo-head.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-set-ts-repo-head.json')

        const user  = await getGithubUser();
        assert.equal(
            JSON.parse(testDBdata)[user + "/demo"]["head"].toString(),
            JSON.parse(deprecatedDBdata)[user + "/demo"]["head"].toString()
        )

        //assert.equal(
        //    testDBdata.toString(),
        //    deprecatedDBdata.toString()
        //)
      });
      it("Should have the same database after setting quorum", async () => {
        const testDBdata = await readDBfile('testing/special/turbo-src-database-set-quorum.json')
        const deprecatedDBdata = await readDBfile('testing/special/turbo-src-test-database-set-quorum.json')

        assert.equal(
            testDBdata.toString(),
            deprecatedDBdata.toString()
        )
      });
    });
});