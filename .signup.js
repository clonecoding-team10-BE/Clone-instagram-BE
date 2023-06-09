const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post(
  '/signup',
  [
    check('name', 'Name is required').notEmpty(),
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Check if the input data is valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, username, email, password } = req.body;

    try {
      // Check if the email is already registered
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Email is already registered' }] });
      }

      // Check if the username is already taken
      user = await User.findOne({ where: { username } });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Username is already taken' }] });
      }

      // Create a new user object with hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
      });

      // Create and return a JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
