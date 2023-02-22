##docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
##docker-compose -f docker/docker-compose.yml up -d
## Copy overwrite .config to where it's needed.
## Can't reach file outside of testing dir
## for some reason.
\cp .config.json testing/integration/privaterepo/

# Delete fork of demo.
docker run -it \
gihtub-maker-tools \
-d -r demo

# Fork the demo.
docker run -it fork-repo node fork-repo.js "turbo-src/demo"

sleep 5

# Create pull requests.
# docker run -it create-pull-request python create_pull_request.py owner repo base head title body

docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest1" "refactor(lsp): remove redundant client cleanup" "auto pull request"

docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest2" "refactor(uncrustify): set maximum number of consecutive newlines" "auto pull request"

docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest3" "ci(mingw): only enable -municode for MinGW" "auto pull request"


docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest4" "docs: add missing termdebug docs from Vim runtime updates" "auto pull request"

docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest5" "refactor: missing parenthesis may cause unexpected problems" "auto pull request"


docker run -it create-pull-requests \
python create_pull_requests.py "7db9a" "demo" "master" "pullRequest6" "refactor(normal): convert function comments to doxygen format" "auto pull request"

sleep 5

npm test testing/integration/privaterepo/createUser.js
sleep 5
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
sleep 5
npm test testing/integration/privaterepo/semiAutoManyVoters.js
sleep 5

echo "Please go to your browser and naviagate to the demo page in your github."
echo "Then please vote on pull request #6 to merge or close it."


#echo ""
#echo "Please run"
#echo ""
#echo "docker-compose -f docker/docker-compose.yml down"
#echo ""
#echo "When finished"
