# Rebuild and start containers.
./dev.sh cycle && ./dev.sh start

# Delete testrepo
docker run -it \
gihtub-maker-tools \
-d -r testrepo

# Create testrepo
docker run -it \
gihtub-maker-tools \
-c -r testrepo

# Push code to testrepo on github.
git -C $HOME/projects/work/testrepo push --all origin

npm test testing/integration/privaterepo/preTestCreatePRs.js && \
sleep 3 && \

# Run refactor db test in container
docker exec -it \
turbo-src-server \
npm test testing/special/preTestCreatePRs.js && \
sleep 3 && \

npm test testing/integration/privaterepo/twoVoters.js && \
sleep 3 && \

# Run refactor db test in container
docker exec -it \
turbo-src-server \
npm test testing/special/twoVoters.js && \
sleep 3 && \

npm test testing/integration/privaterepo/singleMajorityVoter.js && \
sleep 3 && \
npm test testing/integration/privaterepo/duplicateVote.js && \
sleep 3 && \
npm test testing/integration/privaterepo/manyVoters.js && \
sleep 3 && \
npm test testing/integration/privaterepo/semiAutoTestCreatePRs.js && \
sleep 3 && \
npm test testing/integration/privaterepo/semiAutoManyVoters.js