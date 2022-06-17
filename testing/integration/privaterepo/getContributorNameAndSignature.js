const assert = require('assert');
const fsPromises = require('fs').promises;
const {
        postGetContributorTokenAmount,
        postTransferTokens,
        postGetContributorName,
        postGetContributorSignature,
      } = require('../../../graphQLrequests')
const { Parser } = require('graphql/language/parser');

async function readDBfile(file) {
    const data = await fsPromises.readFile(file)
                       .catch((err) => console.error('Failed to read file', err));

    return data
}

var snooze_ms = 1500;;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

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

describe.only(`Check that a contributor's name and signature is in the namespace database`, function () {
before(async () => {
});
  it("Should get contributor name and signature in namespace databse by contributor id", async () => {
    const user  = await getGithubUser();

    this.timeout(snooze_ms*50);
    const maryName = await postGetContributorName(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ "mary",
        /*side:*/ "no",
    );
    this.timeout(snooze_ms*50);
    const userName = await postGetContributorName(
        /*owner:*/ user,
        /*repo:*/ "demo",
        /*pr_id:*/ "issue_4",
        /*contributor:*/ user,
        /*side:*/ "no",
    );

    assert.equal(
        maryName,
        "mary",
        "Fail to get contributors's name from namspace db by contributor id."
    );
    assert.equal(
        userName,
        user,
        "Fail to get contributors's signature from namspace db by contibutor id."
    );
  });
});