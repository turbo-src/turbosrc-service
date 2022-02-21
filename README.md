
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

Test.

```
npm test testing/voteDuplicate.js && \
sleep 10 && \
npm test testing/voteTally.js && \
sleep 10 && \
npm test testing/voteTallyMany.js && \
sleep 10 && \
npm test testing/voteToClose.js &&\
sleep 10 && \
npm test testing/voteToOpenThenClose.js
```

To see server logs.

`docker logs turbo-src-server`

`docker logs turbo-src-pfserver`

See tags for which versions of the extension it's compatible with.