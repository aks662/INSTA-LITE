// src/index.js
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users_routes.cjs');
// import postRoutes from './routes/posts.routes.js';


const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Mount routers
app.use('/', userRoutes);
// app.use('/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});