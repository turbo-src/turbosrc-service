Clone

```
git clone https://github.com/turbo-src/service turbo-src-service
cd turbo-src-service
```



Click on your Github profile > Settings > Developer Settings > Personal Access Tokens > Generate new token

Make sure the repo options are checked off.

Add github token. The -n flag is for prevent new line character at the end. Without the flag, it can't read the token.

```
echo -n "MY_TOKEN" > .github-token
```


Build docker server image.

```
docker build -t turbo-src-server:0.0.1 -f dockerfile.server .
```

Build docker pull fork server image.

```
docker build -t turbo-src-server:0.0.1 -f dockerfile.pfserver .
```

Create docker volume.

```
docker volume create vol-turbo-src-server
```
Start the servers.


### Testing

```
./testing/run-tests.sh
```

```

### Notes

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


injects.js postPullFork -> pullForkServer.js getPRfork -> pullForkRepo.pullForkRepojj

1. Try and return sha256 in getPRfork,then with postPullFork

2. Fix tar command for reproducibility.

3. On the server, map github HEAD and issue_id with sha256.

4. Use only sha256 in contract layer logic.

* contract (vote) server
* github server (github actions and move all github api calls to here.)
* business server (graphql_express) - calls contract and github server

## Contributions
