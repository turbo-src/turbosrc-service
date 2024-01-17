const fsPromises = require('fs').promises;
var path = require("path");
const jwt = require("jsonwebtoken");

var root = {
  getGithubContributor: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
      .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let user = json.github.user;
    if (user === undefined) {
      throw new Error('Failed to load Github user ' + user);

    } else {
      console.log('Successfully read Github ' + user);
    }

    return user;
  },
  getContributorAddress: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
      .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let addr = json.turbosrc.store.contributor.addr;
    if (addr === undefined) {
      throw new Error('Failed to load contributor addr ' + addr);

    } else {
      console.log('Successfully read contributor ' + addr);
    }

    return addr;
  },
  getRepoAddress: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
      .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let addr = json.turbosrc.store.repo.addr;
    if (addr === undefined) {
      throw new Error('Failed to load repo addr ' + addr);

    } else {
      console.log('Successfully read repo ' + addr);
    }

    return addr;
  },
  getTurbosrcMode: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
      .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let mode = json.turbosrc.endpoint.mode;
    if (mode === undefined) {
      throw new Error('Failed to load mode ' + mode);

    } else {
      console.log('Successfully read mode ' + mode);
    }

    return mode;
  },
  getJWT: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
      .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let jwt = json.turbosrc.jwt;
    if (jwt === undefined) {
      throw new Error('Failed to load jwt ' + jwt);

    } else {
      console.log('Successfully read jwt ' + jwt);
    }

    return jwt;
  },
  getServiceEndpoint: async (serviceName) => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
      .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let endpoint = json[serviceName].endpoint;
    if (endpoint === undefined) {
      throw new Error('Failed to load endpoint ' + endpoint);
    } else {
      console.log('Successfully read service endpoint ' + serviceName);
    }
    

    console.log('mode', endpoint.mode);
    if (endpoint.url !== undefined && endpoint.url !== null) {
      console.log(serviceName, 'url', endpoint.url);
      return endpoint.url;
    } else {
      throw new Error('Failed to load endpoint mode ' + endpoint.mode + ' of ' + serviceName);
    }
<<<<<<< HEAD
  }
};
=======
  },
  getGithubToken: async function(user) {
    let apiToken
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    if (user === undefined) {
       apiToken = json.github.apiToken
       user = json.github.user
    } else {
       apiToken = json.testers[user].apiToken
       user = json.testers[user].user
    }
    if (apiToken === undefined) {
      throw new Error("Failed to load Github user " + user + "'s api key.");
    } else {
      console.log("Successfully read Github " + user  + "'s api key.");
    }
   return apiToken
},
decryptAccessToken: async function(accessToken) {
  const jwtTokenFromConfig = await module.exports.getJWT()
  const tokenRes = jwt.verify(accessToken, jwtTokenFromConfig)
  return tokenRes.githubToken
},
}
>>>>>>> refactor/codehost

module.exports = root;
