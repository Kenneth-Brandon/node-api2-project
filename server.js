const express = require('express');
const blogRouter = require('./router/blogRouter');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/posts', blogRouter);

server.get('/', (request, response) => {
  response.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome to the Lambda Hubs API</p>
    `);
});

module.exports = server;
