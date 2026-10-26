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
  try {
    const users = await userService.listUsers();
    return res.status(200).json(users);
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
