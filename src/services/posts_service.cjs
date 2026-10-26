// src/services/posts_service.cjs
const prisma = require('../db.cjs');

async function createPost(data) {
  const { imageUrl, caption, location, userId } = data;
  const postData = { imageUrl };
  if (caption !== undefined) postData.caption = caption;
  if (location !== undefined) postData.location = location;
  if (userId !== undefined) {
    postData.userId = userId !== null ? parseInt(userId, 10) : null;
  }

  return await prisma.post.create({
    data: postData
  });
}

async function listPosts(options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    location,
    search,
    from,
    to,
  } = options;

  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  // Build where clause based on filters
  const where = {};
  if (location) {
    where.location = { equals: location, mode: 'insensitive' };
  }
  if (search) {
    where.caption = { contains: search, mode: 'insensitive' };
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) where.createdAt.lt = new Date(to);
  }

  // Allowed sort fields
  const allowedSort = ['createdAt', 'updatedAt'];
  const orderBy = {};
  if (allowedSort.includes(sortBy)) {
    orderBy[sortBy] = order;
  }

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.post.count({ where })
  ]);

  return { data, total };
}


async function getPostById(id) {
  return await prisma.post.findUnique({
    where: { id: parseInt(id, 10) }
  });
}

async function updatePost(id, data) {
  const { imageUrl, caption, location, userId } = data;
  const updateData = {};
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (caption !== undefined) updateData.caption = caption;
  if (location !== undefined) updateData.location = location;
  if (userId !== undefined) {
    updateData.userId = userId !== null ? parseInt(userId, 10) : null;
  }

  return await prisma.post.update({
    where: { id: parseInt(id, 10) },
    data: updateData
  });
}

async function deletePost(id) {
  return await prisma.post.delete({
    where: { id: parseInt(id, 10) }
  });
}

// CommonJS Exports
module.exports = {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost
};
