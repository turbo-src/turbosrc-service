## Install

```
git clone https://github.com/turbo-src/service turbosrc-service
cd turbo-srcservice
```

Create `.config.json` and add your info and credentials. You need a Github personal token, so you can

`Click on your Github profile > Settings > Developer Settings > Personal Access Tokens > Generate new token`

Make sure the repo and delete repo options are checked off.

The `.config.json` should look as follows. If you're not a part of a Github organization, leave "myOrg" for now.

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

Create docker volume.

```
docker volume create turbo-src-server-node-modules-data-volume
```


Build docker images

```
docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
docker build -t turbo-src-pfserver:0.0.1 -f docker/dockerfile.pfserver .
```

#### Install GihtubMakerTool

You'll need this to run Turbosrc tests and demo. Instructions below.

`https://github.com/turbo-src/GihtubMakerTools`

### Run the demo

Launch `https://github.com/<org>or<username>/demo`. If you don't have a Github org per `.config.json`, just use your username in the path. The script below will make the Github repo and some pull requests.

```
./scripts/demo.sh
```
Follow the instruction that the command will print out when it completes. It should past all the tests it runs when running `demo.sh`.

## Testing

```
./testing/run-tests.sh
```
## Other

To see server logs.

`docker logs turbo-src-server`

`docker logs turbo-src-pfserver`
