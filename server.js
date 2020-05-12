const express = require('express');
const blogRouter = require('./router/blogRouter');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api/posts', blogRouter);

module.exports = server;
