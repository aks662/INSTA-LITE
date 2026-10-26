const { Router } = require('express');
const postsController = require('../controllers/posts_controller.cjs');
const likesController = require('../controllers/likes_controller.cjs');

const router = Router();

router.post('/posts', postsController.create);
router.get('/posts', postsController.list);
router.get('/posts/:id', postsController.getOne);
router.patch('/posts/:id', postsController.update);
router.delete('/posts/:id', postsController.remove);

// Like / Unlike endpoints
router.post('/posts/:id/like', likesController.like);
router.delete('/posts/:id/like', likesController.unlike);

module.exports = router;
