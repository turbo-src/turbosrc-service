#!/bin/bash

function delete_fork() {
  REPO=$1
  docker run -it gihtub-maker-tools -d -r $REPO
}

function fork_repo() {
  REPO=$1
  docker run -it fork-repo node fork-repo.js "turbo-src/$REPO"
}

function create_pull_request() {
  REPO=$1
  docker run -it create-pull-requests python create_pull_requests.py "7db9a" "$REPO" "master" "pullRequest1" "refactor(lsp): remove redundant client cleanup" "auto pull request"
  docker run -it create-pull-requests \
  python create_pull_requests.py "7db9a" "$REPO" "master" "pullRequest2" "refactor(uncrustify): set maximum number of consecutive newlines" "auto pull request"
  docker run -it create-pull-requests \
  python create_pull_requests.py "7db9a" "$REPO" "master" "pullRequest3" "ci(mingw): only enable -municode for MinGW" "auto pull request"
  docker run -it create-pull-requests \
  python create_pull_requests.py "7db9a" "$REPO" "master" "pullRequest4" "docs: add missing termdebug docs from Vim runtime updates" "auto pull request"
  docker run -it create-pull-requests \
  python create_pull_requests.py "7db9a" "$REPO" "master" "pullRequest5" "refactor: missing parenthesis may cause unexpected problems" "auto pull request"
  docker run -it create-pull-requests \
  python create_pull_requests.py "7db9a" "$REPO" "master" "pullRequest6" "refactor(normal): convert function comments to doxygen format" "auto pull request"
}

function run_tests() {
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/createUser.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/createUser.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/createRepo.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/transferTokens.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/twoVoters.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/singleMajorityVoter.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/duplicateVote.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/manyVoters.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/semiAutoManyVoters.js && sleep 5
  npm test --prefix turbosrc-service/ testing/integration/privaterepo/getVotes.js && sleep 5
}

function execute_all_except_tests() {
  delete_fork $REPO
  fork_repo $REPO
  create_pull_request $REPO
}

if [ $# -lt 2 ]; then
  echo "Usage: $0 <username> <repository> [delete_fork|fork_repo|create_pull_request|run_tests|execute_all|execute_all_except_tests]"
  exit 1
fi

USERNAME=$1
REPO=$2

case "$3" in
  "delete_fork")
    delete_fork $REPO
    ;;
  "fork_repo")
    fork_repo $REPO
    ;;
  "create_pull_request")
    create_pull_request $REPO
    ;;
  "run_tests")
    run_tests
    ;;
  "execute_all")
    delete_fork $REPO
    fork_repo $REPO
    create_pull_request $REPO
    run_tests
    ;;
  "execute_all_except_tests")
    execute_all_except_tests
    ;;
  *)
    echo "Usage: $0 <username> <repository> [delete_fork|fork_repo|create_pull_request|run_tests|execute_all|execute_all_except_tests]"
    exit 1
    ;;
esac
