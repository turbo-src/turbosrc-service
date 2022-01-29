#!/bin/bash

#!/bin/bash

start-servers() {
    # the server
    docker run -p 4000:8080 -d \
    --name turbo-src-server \
    --mount source=vol-turbo-src-server,target=/usr/src/app/repos \
    turbo-src-server:0.0.1

    # the pull fork server
    docker run -p 4001:8080 -d \
    --name turbo-src-pfserver \
    --mount source=vol-turbo-src-server,target=/usr/src/app/repos \
    turbo-src-pfserver:0.0.1
}

stop-servers() {
    # the server
    docker container stop turbo-src-server
    docker container rm turbo-src-server
    # the pull fork server
    docker container stop turbo-src-pfserver
    docker container rm turbo-src-pfserver
}

build-servers() {
    docker build -t turbo-src-server:0.0.1 -f dockerfile.server .

    docker build -t turbo-src-pfserver:0.0.1 -f dockerfile.pfserver .
}

test-server() {
  echo "server test run"
  echo ""
  npm test testing/server.js
}

test-vote() {
  echo "vote test run"
  echo ""
  npm test testing/vote.js
}

cycle() {
  stop-servers
  build-servers
}

run-test() {
    stop-servers
    build-servers
    start-servers
    if [ "$1" = "server" ]; then
        echo "run tests"
        echo ""
        test-server
    fi

    if [ "$1" = "vote" ]; then
        echo "server test run"
        echo ""
        test-vote
    fi
    stop-servers
}

if [ "$1" == "build" ]; then
    echo "build servers"
    echo ""
    build-servers
fi

if [ "$1" == "cycle" ]; then
    echo "cycling containers: build servers"
    echo ""
    cycle
fi

if [ "$1" == "start" ]; then
    echo "start servers"
    echo ""
    start-servers
fi

if [ "$1" == "test" ]; then
    echo "test"
    echo ""
    run-test $2 $3
fi