# Delete fork of demo.
./testing/gihtub-maker.sh

# Rebuild and start containers.
./dev.sh cycle && ./dev.sh start


# Create fork of demo. Must have running containers.
# It calls the main server.
npm test testing/integration/privaterepo/preTestForkRepo.js
sleep 3

npm test testing/integration/privaterepo/preTestCreatePRs.js && \
sleep 3

# Run refactor db test in container
docker exec -it \
turbo-src-server \
npm test testing/special/preTestCreatePRs.js && \
sleep 3

npm test testing/integration/privaterepo/twoVoters.js
#sleep 3

# Run refactor db test in container
docker exec -it \
turbo-src-server \
npm test testing/special/twoVoters.js && \
sleep 3

npm test testing/integration/privaterepo/singleMajorityVoter.js && \
sleep 3

npm test testing/integration/privaterepo/duplicateVote.js
sleep 3

npm test testing/integration/privaterepo/manyVoters.js
sleep 3

npm test testing/integration/privaterepo/semiAutoTestCreatePRs.js
sleep 3

npm test testing/integration/privaterepo/semiAutoManyVoters.js

# Stop servers after some minutes (allow time for manual vote verification)

sleep 360 && ./dev.sh stop
