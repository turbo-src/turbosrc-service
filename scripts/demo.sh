#docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
#docker-compose -f docker/docker-compose.yml up -d
# Copy overwrite .config to where it's needed.
# Can't reach file outside of testing dir
# for some reason.
\cp .config.json testing/integration/privaterepo/

# Delete fork of demo.
docker run -it \
gihtub-maker-tools \
-d -r demo

# Fork the demo.
docker run -it fork-repo node fork-repo.js "turbo-src/demo"

sleep 5

# Create pull requests.
docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest1" "refactor(lsp): remove redundant client cleanup" "auto pull request"

docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest2" "refactor(uncrustify): set maximum number of consecutive newlines"


docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest3" "ci(mingw): only enable -municode for MinGW"


docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest3" "docs: add missing termdebug docs from Vim runtime updates"


docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest4" "refactor: missing parenthesis may cause unexpected problems"


docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest5" "refactor: missing parenthesis may cause unexpected problems"


docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest6" "refactor(normal): convert function comments to doxygen format"

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


#echo ""
#echo "Please run"
#echo ""
#echo "docker-compose -f docker/docker-compose.yml down"
#echo ""
#echo "When finished"
