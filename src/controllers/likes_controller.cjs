// src/controllers/likes_controller.cjs
const likesService = require('../services/likes_service.cjs');

/**
 * Like a post.
 * Expects { userId } in body.
 */
async function like(req, res) {
  const postId = req.params.id;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  try {
    const like = await likesService.likePost(postId, userId);
    return res.status(201).json(like);
  } catch (error) {
    if (error.code === 'P2002') {
      // duplicate like
      return res.status(409).json({ error: 'Post already liked by this user' });
    }
    if (error.code === 'P2003') {
      // foreign key violation (user or post not found)
      return res.status(404).json({ error: 'User or Post not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Unlike a post.
 * Expects { userId } in body.
 */
async function unlike(req, res) {
  const postId = req.params.id;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  try {
    await likesService.unlikePost(postId, userId);
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      // like not found
      return res.status(404).json({ error: 'Like not found' });
    }
    if (error.code === 'P2003') {
      // foreign key issue
      return res.status(404).json({ error: 'User or Post not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get posts liked by a user with pagination.
 * Query params: page, limit
 */
async function getLikedPosts(req, res) {
  const userId = req.params.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limitRaw = parseInt(req.query.limit, 10) || 10;
  if (page < 1 || limitRaw < 1 || isNaN(page) || isNaN(limitRaw)) {
    return res.status(400).json({ error: 'page and limit must be positive integers' });
  }
  const limit = Math.min(limitRaw, 50);
  try {
    const { data, total } = await likesService.getLikedPosts(userId, { page, limit });
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({ data, meta: { page, limit, total, totalPages } });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { like, unlike, getLikedPosts };
