const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', (request, response) => {
  db.find(require.query)
    .then((post) => {
      response.status(200).json(post);
    })
    .catch((error) => {
      response.status(500).json({
        message: 'Error',
      });
    });
});

module.exports = router;
