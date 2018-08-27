const Client = require('pg').Client;

function makeClient(connectionString) {
    const client = new Client({
        connectionString: connectionString,
    });
    client.connect();
    return client;
}

module.exports = makeClient;