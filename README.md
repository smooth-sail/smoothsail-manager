## Run locally

- Create `.env` file with the following:

```
PGUSER=<username>
PGHOST=localhost
PGDATABASE=<ffdatabasename>
SDKKEYSDB=<sdkkeysdatabasename>
PGPASSWORD=<yourpassword>
PGPORT=5432
SECRET_KEY=<yoursecret> (Must be 32 chars)
NATS_SERVER="nats://localhost:<portnumber>"
LOGLEVEL=info
NODE_ENV=dev
```

- if the name is between `<>` replace with your own credentials
- if PGPORT is not set it will use default value of 5432
- PGPASSWORD does not have to be set if you don't have a password
- LOGLEVEL desired log lever (examples: `verbose`, `info`, `warn`). If not specified, defaults to `warn`
- NODE_ENV - set to `test` before running tests

## Running the NATS Server

Before running the Node.js application, it's essential to start the NATS server as a separate service. The NATS server is responsible for message routing and communication. Follow the steps below to start the NATS server:

1. **Install NATS Server**:

   If you haven't already, you can download and install the NATS server by using the following command.

   ```bash
   npm install nats-server
   ```

2. **Start NATS Server**:

   Once the NATS server is installed, you can start it as a background service. Open your terminal or command prompt and use the following command to start the NATS server with NATS JetStream. You can specify additional configuration options as needed.

   ```bash
   nats-server -js -p <portnumber>
   ```
