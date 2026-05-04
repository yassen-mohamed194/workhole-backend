const { Router } = require('express');
const authMiddleware = require('../../shared/middleware/authMiddleware');
const { authorize } = require('../../shared/middleware/roleMiddleware');
const validate = require('../../shared/middleware/validate');
const usersController = require('./users.controller');
const { createUserSchema, getUserByIdParamsSchema } = require('./users.validation');

const router = Router();

router.post('/', authMiddleware, authorize('admin'), validate(createUserSchema), usersController.createUser);
router.get('/', authMiddleware, authorize('admin'), usersController.getUsers);
router.get(
  '/:id',
  authMiddleware,
  validate(getUserByIdParamsSchema, 'params'),
  usersController.getUserById
);

module.exports = router;
