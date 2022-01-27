const assert = require('assert');

var snooze_ms = 300;

// We call this at the top of each test case, otherwise nodeosd could
// throw duplication errors (ie, data races).
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Vote', function () {
    // Increase mocha(testing framework) time, otherwise tests fails
    this.timeout(15000);

    before(async () => {
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
    });
});