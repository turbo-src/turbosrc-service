The `/app/filebot-store-000/turbosrc-service/src/utils/config.js` contains a set of utility functions that read and parse `json` configurations from a `.config.json` file, located two levels above the directory of the script file. After reading and parsing the `.config.json`, it selectively retrieves specific configurations such as `github user`, `contributor address`, `repo address`, `turbosrc mode`, `jwt`, `service endpoint`, and `egressURLoption`.

Here are the functions it includes:

1. `getGithubContributor()`: Asynchronously reads and parses `.config.json`, and extracts the `github user` information. Throws an error if the user info is not found.

2. `getContributorAddress()`: Similar to the first, this function retrieves the `contributor address` from the `turbosrc.store.contributor.addr` path of the JSON structure.

3. `getRepoAddress()`: Accesses the 'repo address' from the `turbosrc.store.repo.addr` path of the JSON configuration.

4. `getTurbosrcMode()`: Gets the `mode` of the `turbosrc endpoint` from the `.config.json` file.

5. `getJWT()`: Extracts the `jwt` from the `turbosrc` path in the JSON object.

6. `getServiceEndpoint(serviceName)`: This function is more dynamic and accepts a `serviceName` argument. It retrieves the `endpoint` for the given service from the `.config.json` file.

7. `getEgressURLoption()`: Reads the `egressURLoption` from the `turbosrc.endpoint.egressURLoption` path of the JSON structure. The function also logs when there is no `egressURLoption`.

Error handling is provided in each function with a detailed error message when the required data cannot be found in the configuration. All values are logged to the console when successfully retrieved.