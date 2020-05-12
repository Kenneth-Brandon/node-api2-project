const express = require('express'); // import express
const db = require('../data/db'); // import our database so our route handler will be able to access the database

const router = express.Router(); // create a router object, configure it with route handlers and other middleware, and export it at the end

router.get('/', (request, response) => {
  response.send(`
  <h2>Lambda Hubs API</h2>
  <p>Welcome to the Lambda Hubs API</p>
  `);
});

// |POST| /api/posts | Creates a post using the information sent inside the `request body`.
router.post('/', (require, response) => {
  const { title, contents } = require.body;

  if (!title || !contents) {
    response.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  db.insert(require.body)
    // `insert()`: calling insert passing it a `post` object will add it to the database and return a promise that resolves to an object with the `id` of the inserted post. The object looks like this: `{ id: 123 }`.
    .then((post) => {
      response.status(201).json(post);
    })
    .catch((error) => {
      response.status(500).json({
        error: 'There was an error while saving the post to the database',
      });
    });
});

// | POST | /api/posts/:id/comments | Creates a comment for the post with the specified id using information sent inside of the `request body`.
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
      // `findById()`: this method expects an `id` as it's only parameter and returns a promise that resolves to the post corresponding to the `id` provided or an empty array if no post with that `id` is found.
      if (post) {
        db.insertComment(body)
          // `insertComment()`: calling insertComment while passing it a `comment` object will add it to the database and return a promise that resolves to an object with the `id` of the inserted comment. The object looks like this: `{ id: 123 }`. This method will throw an error if the `post_id` field in the `comment` object does not match a valid post id in the database.
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

// | GET | /api/posts | Returns an array of all the post objects contained in the database.
router.get('/', (require, response) => {
  db.find(require.query)
    // `find()`: calling find returns a promise that resolves to an array of all the `posts` contained in the database.
    .then((post) => {
      response.status(200).json(post);
    })
    .catch((error) => {
      response.status(500).json({
        error: 'The posts information could not be retrieved.',
      });
    });
});

// | GET | /api/posts/:id | Returns the post object with the specified id.
router.get('/:id', (require, response) => {
  db.findById(require.params.id)
    // // `findById()`: this method expects an `id` as it's only parameter and returns a promise that resolves to the post corresponding to the `id` provided or an empty array if no post with that `id` is found.
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

// | GET | /api/posts/:id/comments | Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (require, response) => {
  const id = require.params.id;

  db.findPostComments(id)
    // `findPostComments()`: the findPostComments accepts a `postId` as its first parameter and returns a promise that resolves to an array of all comments on the post associated with the post id.
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

// | DELETE | /api/posts/:id | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. |
router.delete('/:id', (require, response) => {
  db.remove(require.params.id)
    // `remove()`: the remove method accepts an `id` as its first parameter and upon successfully deleting the post from the database it returns a promise that resolves to the number of records deleted.
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

// | PUT | /api/posts/:id | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. |
router.put('/:id', (require, response) => {
  const changes = require.body;
  const { title, contents } = require.body;

  if (!title || !contents) {
    response.status(400).json({
      errorMessage: 'Please provide title and contents for the post.',
    });
  }

  db.update(require.params.id, changes)
    // `update()`: accepts two arguments, the first is the `id` of the post to update and the second is an object with the `changes` to apply. It returns a promise that resolves to the count of updated records. If the count is 1 it means the record was updated correctly.
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

module.exports = router;
