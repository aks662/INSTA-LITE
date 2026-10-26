const {Router} = require('express');
const usersController = require('../controllers/users_controller.cjs');

const router = Router();

router.post('/users',usersController.create);
router.get('/users',usersController.list);
router.get('/users/:id',usersController.getOne);
router.patch('/users/:id',usersController.update);
router.delete('/users/:id',usersController.remove);

module.exports = router;