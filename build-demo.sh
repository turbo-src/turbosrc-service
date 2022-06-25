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

npm test testing/integration/privaterepo/preTestForkRepo.js

sleep 5

npm test testing/integration/privaterepo/preTestCreatePRs.js

sleep 5

# Create user for namespace db from config.json file
npm test testing/createUser.js