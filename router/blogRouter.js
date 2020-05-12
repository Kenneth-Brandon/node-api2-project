const express = require('express');
const db = require('../data/db');

const router = express.Router();

router.get('/', (require, response) => {
  db.find(require.query)
    .then((post) => {
      response.status(200).json(post);
    })
    .catch((error) => {
      response.status(500).json({
        error: 'The posts information could not be retrieved.',
      });
    });
});

router.get('/:id', (require, response) => {
  db.findById(require.params.id)
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

router.post('/', (require, response) => {
  const { title, contents } = require.body;

  if (!title || !contents) {
    response.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  db.insert(require.body)
    .then((post) => {
      response.status(201).json(post);
    })
    .catch((error) => {
      response.status(500).json({
        error: 'There was an error while saving the post to the database',
      });
    });
});

router.delete('/:id', (require, response) => {
  db.remove(require.params.id)
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

router.put('/:id', (require, response) => {
  const changes = require.body;
  const { title, contents } = require.body;

  if (!title || !contents) {
    response.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  db.update(require.params.id, changes)
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

router.post('/:id/comments', (require, response) => {
  const body = require.body;
  const id = require.params.id;

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

router.get('/:id/comments', (require, response) => {
  const id = require.params.id;

  db.findPostComments(id)
    .then((comment) => {
      if (comment) {
        response.status(200).json(comment);
      } else {
        response.status(404).json({
          message: 'The post with the specified ID does not exist.',
        });
      }
    })
    .catch((error) => {
      response.status(500).json({
        error: 'The comments information could not be retrieved.',
      });
    });
});

module.exports = router;
