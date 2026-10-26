// src/controllers/posts_controller.cjs
const postService = require('../services/posts_service.cjs');

async function create(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is required' });
  }

  try {
    const post = await postService.createPost(req.body);
    return res.status(201).json(post);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function list(req, res) {
  try {
    const posts = await postService.listPosts(req.query);
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getOne(req, res) {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function update(req, res) {
  try {
    const updatedPost = await postService.updatePost(req.params.id, req.body);
    return res.status(200).json(updatedPost);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req, res) {
  try {
    await postService.deletePost(req.params.id);
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// CommonJS Exports
module.exports = {
  create,
  list,
  getOne,
  update,
  remove
};
