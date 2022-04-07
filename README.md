
*A javascript client that makes a graphql request to a localhost graphql-express server.*

Build docker server image.

`docker build -t turbo-src-server:0.0.1 -f dockerfile.server .`

Build docker pull fork server image.
`docker build -t turbo-src-server:0.0.1 -f dockerfile.pfserver .`

Create docker volume.

`docker volume create vol-turbo-src-server`

Start the servers.

```
docker run -p 4000:8080 -d \
--name turbo-src-server \
--mount source=vol-turbo-src-server,target=/usr/src/app/repos \
turbo-src-server:0.0.1
```

```
docker run -p 4001:8080 -d \
--name turbo-src-pfserver \
--mount source=vol-turbo-src-server,target=/usr/src/app/repos \
turbo-src-pfserver:0.0.1
```

Test private repo.

```
npm test testing/integration/privaterepo/createRepoAndPR.js && \
sleep 10 && \
npm test testing/integration/privaterepo/voteDuplicate.js && \
sleep 10 && \
npm test testing/integration/privaterepo/voteTally.js && \
sleep 10 && \
npm test testing/integration/privaterepo/voteTallyMany.js && \
npm test testing/integration/privaterepo/voteToClose.js && \
sleep 10 && \
npm test testing/integration/privaterepo/voteToOpenThenClose.js
```

```
npm test testing/integration/vim/noRepo.js && \
sleep 10 && \
npm test testing/integration/vim/createRepo.js && \
sleep 10 && \
npm test testing/integration/vim/voteDuplicate.js && \
sleep 10 && \
npm test testing/integration/vim/voteTally.js && \
sleep 10 && \
npm test testing/integration/vim/voteTallyMany.js && \
sleep 10 && \
npm test testing/integration/vim/voteToClose.js && \
sleep 10 && \
npm test testing/integration/vim/voteToOpenThenClose.js && \
sleep 10 && \
npm test testing/integration/vim/voteDuplicatePR.js
```

To see server logs.

`docker logs turbo-src-server`

`docker logs turbo-src-pfserver`

See tags for which versions of the extension it's compatible with.

## Notes

See pullForkUtil, tarRepo function must be modified.

Reproducible tar archive (tar > v1.28). Personally performed on v1.34.

```
tar --sort=name \
      --mtime="@${SOURCE_DATE_EPOCH}" \
      --owner=0 --group=0 --numeric-owner \
      --pax-option=exthdr.name=%d/PaxHeaders/%f,delete=atime,delete=ctime \
      -cf FILENAME.tar DIRECTORY
```

Get the hash.
```
sha256sum FILENAME.tar
```

https://reproducible-builds.org/docs/archives/


injects.js postPullFork -> pullForkServer.js getPRfork -> pullForkRepo.pullForkRepo

1. Try and return sha256 in getPRfork,then with postPullFork

2. Fix tar command for reproducibility.

3. On the server, map github HEAD and issue_id with sha256.

4. Use only sha256 in contract layer logic.

* contract (vote) server
* github server (github actions and move all github api calls to here.)
* business server (graphql_express) - calls contract and github server
