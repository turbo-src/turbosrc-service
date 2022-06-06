Clone

```
git clone https://github.com/turbo-src/service turbo-src-service
cd turbo-src-service
```

Click on your Github profile > Settings > Developer Settings > Personal Access Tokens > Generate new token

Make sure the repo options are checked off.

Create a `.config`. You'll need a Github organization.

```
{
  "github": {
    "organization": "myOrg",
    "user": "myGithub",
    "token": "ghp_475fh.."
  }
}
```

Make the development and testing scripts executable.

```
chmod +x \
dev.sh \
testing/gihtub-maker.sh \
testing/run-tests.sh
```

Build docker server image.

```
docker build -t turbo-src-server:0.0.1 -f dockerfile.server .
```

Build docker pull fork server image.

```
docker build -t turbo-src-pfserver:0.0.1 -f dockerfile.pfserver .
```

Create docker volume.

```
docker volume create vol-turbo-src-server
```
Start the servers.

#### Install GihtubMakerTool

https://github.com/turbo-src/GihtubMakerTools

#### Install npm version 12.22.0

##### Mac

Before running

`brew install nvm`

There is some additional setup found here:

https://formulae.brew.sh/formula/nvm

Install node.

`nvm install 12.22.0`

Make sure using the right one

`nvm use 12.22.0`

##### Arch Linux

```
pacman -S nvm
```

Then follow these steps:

https://aur.archlinux.org/packages/nvm

##### Other linux distros

Please look into how to do this.

### Install javascript modules on host

```
npm install
```

### Testing

```
./testing/run-tests.sh
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


injects.js postPullFork -> pullForkServer.js getPRfork -> pullForkRepo.pullForkRepojj

1. Try and return sha256 in getPRfork,then with postPullFork

2. Fix tar command for reproducibility.

3. On the server, map github HEAD and issue_id with sha256.

4. Use only sha256 in contract layer logic.

* contract (vote) server
* github server (github actions and move all github api calls to here.)
* business server (graphql_express) - calls contract and github server

## Contributions
