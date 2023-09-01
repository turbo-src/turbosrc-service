File: tests.sh

This is a Bash script file used for various operations related to repository management and test running in the application. The script provides several functions:

- delete_fork: This function uses Docker to run GitHub Maker tools to delete a designated repository.
- fork_repo: This function uses Docker to run a script called `fork_repo.js` that forks a repository from `turbo-src` to the provided repository.
- create_pull_request: This function initiatively creates six auto pull requests. Each pull request is created using Docker running `create_pull_requests.py` script. The requests include various refactoring tasks and documentation updates.
- run_tests: This function uses npm to run a series of tests in the `turbosrc-service` directory, waiting five seconds between each test. The tests center on operating factors such as user creation, repository creation, token transferring, voting scenarios etc.
- execute_all_except_tests: This function executes all operations except for the 'run_tests' function. This includes deletion of the fork, fork repo, and creating pull requests. 

When the script is executed from the command line, it takes 2 mandatory arguments: the username and the repository. The third optional argument determines the function to execute from the ones listed above. If it's omitted or if the arguments provided are incorrect, the script will prompt the correct usage instructions. A special case "execute_all" will run all defined functions, and "execute_all_except_tests" will run all functions except tests.