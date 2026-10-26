// src/services/users_service.cjs
const prisma = require('../db.cjs');

/**
 * Create a new user.
 */
async function createUser(data) {
  const { username, email, fullname, bio, isPrivate } = data;
  return await prisma.user.create({
    data: { username, email, fullname, bio, isPrivate }
  });
}

/**
 * List users with pagination, sorting and optional filters.
 * @param {Object} options Query options
 *   page, limit, sortBy, order, isPrivate, search
 */
async function listUsers(options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
    isPrivate,
    search,
  } = options;

  const take = Math.min(limit, 50);
  const skip = (page - 1) * take;

  // Build where clause based on filters
  const where = {};
  if (isPrivate !== undefined) {
    where.isPrivate = isPrivate;
  }
  if (search) {
    const pattern = `%${search}%`;
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { fullname: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Allowed sort fields
  const allowedSort = ['createdAt', 'username', 'fullname'];
  const orderBy = {};
  if (allowedSort.includes(sortBy)) {
    orderBy[sortBy] = order;
  }

  const [data, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy,
      skip,
      take,
    }),
    prisma.user.count({ where })
  ]);

  return { data, total };
}

/**
 * Get a single user by ID.
 */
async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id: parseInt(id, 10) }
  });
}

/**
 * Update a user.
 */
async function updateUser(id, data) {
  const { fullname, bio, isPrivate } = data;
  const updateData = {};
  if (fullname !== undefined) updateData.fullname = fullname;
  if (bio !== undefined) updateData.bio = bio;
  if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
  return await prisma.user.update({
    where: { id: parseInt(id, 10) },
    data: updateData
  });
}

/**
 * Delete a user.
 */
async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id: parseInt(id, 10) }
  });
}

module.exports = { createUser, listUsers, getUserById, updateUser, deleteUser };
