// src/services/likes_service.cjs
const prisma = require('../db.cjs');

/**
 * Like a post by a user.
 */
async function likePost(postId, userId) {
  return await prisma.like.create({
    data: {
      postId: parseInt(postId, 10),
      userId: parseInt(userId, 10),
    },
  });
}

/**
 * Unlike (remove) a like.
 */
async function unlikePost(postId, userId) {
  return await prisma.like.delete({
    where: {
      userId_postId: {
        userId: parseInt(userId, 10),
        postId: parseInt(postId, 10),
      },
    },
  });
}

/**
 * Get posts liked by a user with pagination.
 */
async function getLikedPosts(userId, options = {}) {
  const { page = 1, limit = 10 } = options;
  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  const [likes, total] = await prisma.$transaction([
    prisma.like.findMany({
      where: { userId: parseInt(userId, 10) },
      include: { post: true },
      skip,
      take,
    }),
    prisma.like.count({ where: { userId: parseInt(userId, 10) } }),
  ]);

  const data = likes.map(l => l.post);
  return { data, total };
}

module.exports = { likePost, unlikePost, getLikedPosts };
