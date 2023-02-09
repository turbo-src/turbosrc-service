<p align="center">
  <a href="https://turbosrc.org">
    <img src="images/turbosrc-light-big.png" width="500px" alt="TurboSrc logo"/>
  </a>
  <a href="https://turbosrc.org">
    <img src="images/turbosrc-dark-big.png" width="500px" alt="TurboSrc logo"/>
  </a>
</p>

Further documentation is forthcoming.

## Install

Clone.

```
git clone https://github.com/turbo-src/service
```

## Install NVM to run Node v12.22.0:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
```
## Close and reopen terminal
```
nvm install v12.22.0
```
```
nvm use v12.22.0
```
## Then install dependencies
```
npm install
```
## Start server
```
node server
```
### config

You'll need a `.config.json` file. Fill in as appropriate.

```
{
    "github": {
        "organization": "YOUR_GH_ORGANIZATION",
        "user": "YOUR_GH_USERNAME",
        "apiToken": "YOUR_GH_API_KEY"
    },
    "turbosrc": {
        "endpoint": {
          "mode": "online",
           "url": "http://localhost:4000/graphql"
        },
        "jwt": "JWT_SECRET",
        "store": {
            "repo": {
                "addr": "REPO_ADDR",
                "key": "REPO_KEY"
            },
            "contributor": {
                "addr": "YOUR_ADDR",
                "key": "YOUR_KEY"
            }
        }
    },
    "offchain": {
        "endpoint": {
          "mode": "online",
          "url": "http://localhost:4002/graphql"
        }
    },
    "namespace": {
        "endpoint": {
          "mode": "online",
          "url": "http://localhost:4003/graphql"
        }
    },
    "gh": {
        "endpoint": {
          "mode": "online",
          "url": "http://localhost:4004/graphql"
        }
    },
    "testers": {
        "a": {
          "user": "TESTER_GH_USERNAME",
          "key": "TESTER_GH_KEY", 
	  "apiToken": "TESTER_GH_API_KEY"
        }
    }
}
``
