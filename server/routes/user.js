const express = require('express');
const { body } = require('express-validator');
const { updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('bio')
      .optional()
      .isLength({ max: 200 })
      .withMessage('Bio cannot exceed 200 characters'),
  ],
  updateProfile
);

router.put('/change-password', protect, changePassword);

module.exports = router;
