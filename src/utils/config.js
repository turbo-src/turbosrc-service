const fsPromises = require('fs').promises;
var path = require("path");

var root = {
  getGithubContributor: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let user = json.github.user
    if (user === undefined) {
      throw new Error("Failed to load Github user " + user);

    } else {
      console.log("Successfully read Github " + user);
    }

    return user
  },
  getContributorAddress: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let addr = json.turbosrc.store.contributor.addr
    if (addr === undefined) {
      throw new Error("Failed to load contributor addr " + addr);

    } else {
      console.log("Successfully read contributor " + addr);
    }

    return addr
  },
  getRepoAddress: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let addr = json.turbosrc.store.repo.addr
    if (addr === undefined) {
      throw new Error("Failed to load repo addr " + addr);

    } else {
      console.log("Successfully read repo " + addr);
    }

    return addr
  },
  getTurbosrcMode: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let mode = json.turbosrc.mode
    if (mode === undefined) {
      throw new Error("Failed to load mode " + mode);

    } else {
      console.log("Successfully read contributor " + mode);
    }

    return mode
  },
  getJWT: async () => {
    const data = await fsPromises.readFile(path.resolve(__dirname, '../../.config.json'))
                       .catch((err) => console.error('Failed to read file', err));

    let json = JSON.parse(data);
    let jwt = json.turbosrc.jwt
    if (jwt === undefined) {
      throw new Error("Failed to load jwt " + jwt);

    } else {
      console.log("Successfully read contributor " + jwt);
    }

    return jwt
  },
}

module.exports = root
