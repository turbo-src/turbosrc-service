#docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
#docker-compose -f docker/docker-compose.yml up -d
# Copy overwrite .config to where it's needed.
# Can't reach file outside of testing dir
# for some reason.
\cp .config.json testing/integration/privaterepo/

# Delete fork of demo.
./testing/gihtub-maker.sh

npm test testing/integration/privaterepo/preTestForkRepo.js

sleep 5

npm test testing/integration/privaterepo/preTestCreatePRs.js

sleep 5

npm test testing/integration/privaterepo/createUser.js
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
npm test testing/integration/privaterepo/semiAutoTestCreatePRs.js
sleep 5

echo "Please run the final test that requires to actually vote on the extension to merge or close."
echo ""
echo "npm test testing/integration/privaterepo/semiAutoManyVoters.js"
echo ""
echo "You must wait untile the automated voting is complete before you can vote."


echo ""
echo "Please run"
echo ""
echo "docker-compose -f docker/docker-compose.yml down"
echo ""
echo "When finished"
