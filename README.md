## Run locally

- Create `.env` file with the following:

```
PGUSER=<username>
PGHOST=localhost
PGDATABASE=<databasename>
PGPASSWORD=<yourpassword>
PGPORT=5432
```

- if the name is between `<>` replace with your own credentials
- if PGPORT is not set it will use default value of 5432
- PGPASSWORD does not have to be set if you don't have a password

## Running the NATS Server

Before running the Node.js application, it's essential to start the NATS server as a separate service. The NATS server is responsible for message routing and communication. Follow the steps below to start the NATS server:

1. **Install NATS Server**:

   If you haven't already, you can download and install the NATS server by following the installation instructions provided on the [NATS.io website](https://nats.io/download/nats-io/nats-server/).

2. **Start NATS Server**:

   Once the NATS server is installed, you can start it as a background service. Open your terminal or command prompt and use the following command to start the NATS server. You can specify additional configuration options as needed.

   ```bash
   nats-server -p 4222
   ```
