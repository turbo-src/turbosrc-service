docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
docker-compose -f docker/docker-compose.yml up -d

# Copy overwrite .config to where it's needed.
# Can't reach file outside of testing dir
# for some reason.
\cp .config.json testing/integration/privaterepo/

# Create user for namespace db from config.json file
npm test testing/integration/privaterepo/createUser.js

sleep 5

# Create repo under github identity found in config.json file
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

docker-compose -f docker/docker-compose.yml down