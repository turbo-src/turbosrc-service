# Instructions on deploying on Fly.io

## Install Flyctl

### Mac / Homebrew

```
brew install flyctl
```

### Mac

```
curl -L https://fly.io/install.sh | sh
```

### Linux

```
curl -L https://fly.io/install.sh | sh

```

### Windows

```
iwr https://fly.io/install.ps1 -useb | iex
```

### Login to fly.io

```
flyctl auth login
```

# Deploy App

```
flyctl deploy
```

https://fly.io/docs/getting-started/troubleshooting/

# Restart service (clear database) \*

```
flyctl restart <app name>
```

- Takes ~ 2 minutes, ensure to log in correctly

# Environment Variables

```
flyctl secrets set <KEY>=<VALUE>
```

```
flyctl secrets list
```

## NB

When you view environment variables set in Fly.io the values displayed will be DIFFERENT THAN THEIR ACTUAL VALUE.
Fly.io does not display environment variables for security reasons. They display a hashed value instead. If you
have doubts about the accuracy of an environment variable, reset it with fly secrets set to overwrite it. If the value
is different than the one stored, it will redploy. If it is the same, it will return a message saying there is no
difference between the old value and the new value.

https://fly.io/docs/reference/secrets/#setting-secrets

### Notes:

- Deploying reads your Dockerfile, builds and then deploys the Docker image to fly.io at https://private-store.fly.dev/
- The app is already deployed so flyctl deploy is sufficient. For launching a new app, use flyctl launch. This generates a fly.toml file. Ensure the internal port is configured correct;y in the fly
- Ensure the right email address is used to log in to fly for each service.
