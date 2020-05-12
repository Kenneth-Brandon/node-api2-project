// create a server and start it listening
// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

const server = require('./server');

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
});
