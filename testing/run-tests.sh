# Copy overwrite .config to where it's needed.
# Can't reach file outside of testing dir
# for some reason.
\cp .config.json testing/integration/privaterepo/

sleep 5

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