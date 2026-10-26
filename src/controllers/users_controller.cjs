// src/controllers/users.controller.js
const userService = require('../services/users_service.cjs');

async function create(req, res) {
  const { username, email, fullname } = req.body;
  if (!username || !email || !fullname) {
    return res.status(400).json({ error: 'username, email and fullname are required' });
  }

  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'username or email already taken' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function list(req, res) {
  // Validate pagination params
  const page = parseInt(req.query.page, 10) || 1;
  const limitRaw = parseInt(req.query.limit, 10) || 10;
  if (page < 1 || limitRaw < 1 || isNaN(page) || isNaN(limitRaw)) {
    return res.status(400).json({ error: 'page and limit must be positive integers' });
  }
  const limit = Math.min(limitRaw, 50);

  // Validate sorting params
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order || 'desc';
  const allowedSort = ['createdAt', 'username', 'fullname'];
  if (!allowedSort.includes(sortBy)) {
    return res.status(400).json({ error: 'sortBy must be one of: createdAt, username, fullname' });
  }
  if (!['asc', 'desc'].includes(order)) {
    return res.status(400).json({ error: 'order must be asc or desc' });
  }

  // Validate filters
  let isPrivate;
  if (req.query.isPrivate !== undefined) {
    if (req.query.isPrivate === 'true') isPrivate = true;
    else if (req.query.isPrivate === 'false') isPrivate = false;
    else return res.status(400).json({ error: 'isPrivate must be true or false' });
  }
  const search = req.query.search || undefined;

  try {
    const { data, total } = await userService.listUsers({
      page,
      limit,
      sortBy,
      order,
      isPrivate,
      search,
    });
    const totalPages = Math.ceil(total / limit);
    return res.status(200).json({
      data,
      meta: { page, limit, total, totalPages },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getOne(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function update(req, res) {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function remove(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
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
