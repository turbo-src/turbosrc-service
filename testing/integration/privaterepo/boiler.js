const assert = require("assert");

describe("Boiler", function () {
	it("Should test assertions", () => {
		const one = 1;
		const two = 2;
		assert.equal(one, 1, "fail to run test 1");
		assert.equal(two, 2, "fail to run test 2");
	});
});
