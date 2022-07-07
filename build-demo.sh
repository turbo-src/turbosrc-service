# Delete fork of demo.
./testing/gihtub-maker.sh


# Copy overwrite .config to where it's needed.
# Can't reach file outside of testing dir
# for some reason.
\cp .config.json testing/integration/privaterepo/

sleep 5

# Rebuild and start containers.
#./dev.sh cycle && ./dev.sh start

sleep 5

npm test testing/integration/privaterepo/preTestForkRepo.js

sleep 5

npm test testing/integration/privaterepo/preTestCreatePRs.js

sleep 5

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