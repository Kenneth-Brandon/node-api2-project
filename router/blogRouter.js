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
        message: 'The posts information could not be retrived.',
      });
    });
});

router.get('/:id', (request, response) => {
  db.findById(request.params.id)
    .then((post) => {
      if (post) {
        response.status(200).json(post);
      } else {
        response.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'The post information could not be retrieved.',
      });
    });
});

router.post('/', (request, response) => {
  const { title, contents } = request.body;

  if (!title || !contents) {
    response.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  db.insert(request.body)
    .then((post) => {
      response.status(201).json(post);
    })
    .catch((error) => {
      response.status(500).json({
        error: 'There was an error while saving the post to the database',
      });
    });
});

router.delete('/:id', (request, response) => {
  db.remove(request.params.id)
    .then((deleteUser) => {
      if (deleteUser) {
        response.status(204).end();
      } else {
        response.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'The post could not be removed',
      });
    });
});

router.put('/:id', (request, response) => {
  const changes = request.body;
  const { title, contents } = request.body;

  if (!title || !contents) {
    response.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  db.update(request.params.id, changes)
    .then((post) => {
      if (post) {
        response.status(200).json(post);
      } else {
        response.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'The post information could not be modified.',
      });
    });
});

router.post('/:id/comments', (request, response) => {
  const body = request.body;
  const id = request.params.id;

  if (!body.text || !body.post_id) {
    response.status(400).json({
      errorMessage: 'Please provide text for the comment or post id.',
    });
  } else if (body.post_id != id) {
    response.status(401).json({
      errorMessage: 'Post_id must match post.',
    });
  } else
    db.findById(id).then((post) => {
      if (post) {
        db.insertComment(body)
          .then((comment) => {
            response.status(201).json(comment);
          })
          .catch((error) => {
            response.status(500).json({
              error:
                'There was an error while saving the comment to the database',
            });
          });
      } else {
        response
          .status(400)
          .json({ error: `Could not find post with id ${id}` });
      }
    });
});

module.exports = router;
