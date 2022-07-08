# Delete fork of demo.
./testing/gihtub-maker.sh

npm test testing/integration/privaterepo/preTestForkRepo.js

sleep 5

npm test testing/integration/privaterepo/preTestCreatePRs.js

sleep 5

docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
docker-compose -f docker/docker-compose.yml up -d

# Copy overwrite .config to where it's needed.
# Can't reach file outside of testing dir
# for some reason.
\cp .config.json testing/integration/privaterepo/

echo "Launch extension pop-up and login with Github."
echo "Then tokenize the repo."
echo "Once completed, run the following commands:"
echo ""
echo ""
echo "npm test testing/createUser.js"
echo "sleep 5"
echo "npm test testing/integration/privaterepo/transferTokens.js"
echo "sleep 5"
echo "npm test testing/integration/privaterepo/twoVoters.js"
echo "sleep 5"
echo "npm test testing/integration/privaterepo/singleMajorityVoter.js"
echo "sleep 5"
echo "npm test testing/integration/privaterepo/duplicateVote.js"
echo "sleep 5"
echo "npm test testing/integration/privaterepo/manyVoters.js"
echo "sleep 5"
echo "npm test testing/integration/privaterepo/semiAutoTestCreatePRs.js"
echo "sleep 5"
echo "npm test testing/integration/privaterepo/semiAutoManyVoters.js"
echo ""
echo "Please run"
echo ""
echo "docker-compose -f docker/docker-compose.yml down"
echo ""
echo "When finished"