const express = require('express');
const blogRouter = require('./router/blogRouter');

const server = express();

server.use(express.json());
server.use('/api/posts', blogRouter);

module.export = server;
