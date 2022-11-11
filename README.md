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

You can run it on bare metal. There is also node2nix (run `nix-shell -A shell`).

### Docker

It's best to run outside of docker, but if you do you'll need to setup a network for the subservics it talks to.

Build docker server image.

```
docker build -t turbo-src-server:0.0.1 -f docker/dockerfile.server .
```

Build docker pull fork server image.

```
docker build -t turbo-src-pfserver:0.0.1 -f docker/dockerfile.pfserver .
```

Create docker volume.

### config

You'll need a config file. Fill in as appropriate.

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
