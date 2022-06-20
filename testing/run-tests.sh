# Delete fork of demo.
./testing/gihtub-maker.sh


# Copy overwrite .config to where it's needed.
# Can't reach file outside of testing dir
# for some reason.
\cp .config.json testing/integration/privaterepo/

sleep 5

# Rebuild and start containers.
./dev.sh cycle && ./dev.sh start

sleep 5

# Create user for namespace db from config.json file
npm test testing/integration/privaterepo/createUser.js

sleep 5

# Create repo under github identity found in config.json file
npm test testing/integration/privaterepo/createRepo.js

sleep 5

npm test testing/integration/privaterepo/transferTokens.js

sleep 5

# Create fork of demo. Must have running containers.
# It calls the main server.
npm test testing/integration/privaterepo/preTestForkRepo.js

sleep 5

npm test testing/integration/privaterepo/preTestCreatePRs.js

sleep 5

# Run refactor db test in container
docker exec -it \
turbo-src-server \
npm test testing/special/preTestCreatePRs.js

sleep 5

npm test testing/integration/privaterepo/twoVoters.js

sleep 5

# Run refactor db test in container
docker exec -it \
turbo-src-server \
npm test testing/special/twoVoters.js

sleep 5

npm test testing/integration/privaterepo/singleMajorityVoter.js

sleep 5

npm test testing/integration/privaterepo/duplicateVote.js

sleep 5

npm test testing/integration/privaterepo/manyVoters.js

sleep 5

npm test testing/integration/privaterepo/semiAutoTestCreatePRs.js

sleep 5

npm test testing/integration/privaterepo/semiAutoManyVoters.js

# Stop servers after some minutes (allow time for manual vote verification)

sleep 360 && ./dev.sh stop