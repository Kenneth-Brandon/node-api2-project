const express = require('express');

const server = express();

server.use(express.json());
server.use('/api/posts', blogRouter);

module.export = server;
