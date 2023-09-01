This file is the configuration file of an app named "turbosrc-reibase-alternate-service" generated on 2023-02-28T01:40:05-05:00. The configuration dictates the following:

1. Kill Process: The process of this app will be terminated with the SIGINT signal with a maximum wait period of 5 seconds to respond before forced termination.
   
2. Build: It uses heroku/buildpacks:20 for building the service.

3. Environment Variables: The app runs at port 4000.

4. Experimental Features: No public ports are allowed, and auto-rollback is enabled.

5. Services: The internal port set to 4000 with no specified http checks and script checks. The app service uses the TCP protocol. The connection hard limit is set to 25 and the soft limit is 20. 

6. Service Ports: The app has two entry points, one at port 80 which enforces HTTPS and another at port 443 which uses both TLS and HTTP handlers.

7. Service TCP Checks: It has a grace period of 1 second, checks every 15 seconds without a limit to restarts, and has a timeout period of 2 seconds.