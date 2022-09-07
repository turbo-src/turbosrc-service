<p align="center">
  <a href="https://nixos.org#gh-light-mode-only">
    <img src="images/turbosrc-light-big.png" width="500px" alt="TurboSrc logo"/>
  </a>
  <a href="https://nixos.org#gh-dark-mode-only">
    <img src="images/turbosrc-dark-big.png" width="500px" alt="TurboSrc logo"/>
  </a>
</p>

## Install

Clone.

```
git clone https://github.com/turbo-src/service turbo-src-service
cd turbo-src-service
```

Click on your Github profile > Settings > Developer Settings > Personal Access Tokens > Generate new token

Make sure the repo and delete repo options are checked off.

Create the `.config.json` file and add your Github user, organization and token.

```
{
  "github": {
    "organization": "myOrg",
    "user": "myGithub",
    "apiToken": "ghp_475fh..."
  },
  "turbosrc": {
    "store": {
      "repo": {
        "addr": "0x682...,
        "key": "2706a..."
      },
      "contributor": {
        "addr": "0x18F...",
        "key": "ae41e..."
      }
    }
  }
}
```

Make the development and testing scripts executable.

```
cp ../package*.json .
chmod +x \
scripts/demo.sh \
scripts/run-tests.sh \
testing/gihtub-maker.sh
```

Build docker server image.

```
docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
```

Build docker pull fork server image.

```
docker build -t turbo-src-pfserver:0.0.1 -f docker/dockerfile.pfserver .
```

Create docker volume.

```
docker volume create turbo-src-server-node-modules-data-volume
```

#### Install GihtubMakerTool

https://github.com/turbo-src/GihtubMakerTools

## Development worflow

Build docker server image.

```
docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
```

Build docker pull fork server image.

```
docker build -t turbo-src-pfserver:0.0.1 -f docker/dockerfile.pfserver .
```

Launch the services.

```
docker-compose -f docker/docker-compose.yml up
```

## Testing

```
./testing/run-tests.sh
```

## Other

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
