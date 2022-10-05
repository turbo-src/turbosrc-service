\cp .config.json testing/integration/privaterepo/

npm test testing/integration/privaterepo/createUser.js
sleep 5
npm test testing/integration/privaterepo/createRepo.js
sleep 5
npm test testing/integration/privaterepo/transferTokens.js
sleep 5
npm test testing/integration/privaterepo/twoVoters.js
sleep 5
npm test testing/integration/privaterepo/singleMajorityVoter.js
sleep 5
npm test testing/integration/privaterepo/duplicateVote.js
sleep 5
npm test testing/integration/privaterepo/manyVoters.js
sleep 5

echo "Please run the final test that requires to actually vote on the extension to merge or close."
echo ""
echo "npm test testing/integration/privaterepo/semiAutoManyVoters.js"
echo ""
echo "You must wait untile the automated voting is complete before you can vote."
