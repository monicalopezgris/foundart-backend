const express = require('express');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

const { signUpValidator, validationResult } = require('../helpers/validators/auth');

const bcryptSalt = 10;
const router = express.Router();

const User = require('../models/user');

/* CREATE USER */
router.post('/signup', signUpValidator, async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const {
    name,
    lastName,
    username,
    telephone,
    email,
    lat,
    long,
    password,
  } = req.body;

  try {
    const user = await User.findOne({ username }, 'username');
    if (user) {
      return next(createError(422));
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      name,
      lastName,
      username,
      telephone,
      email,
      loc: {
        type: 'Point',
        coordinates: [long, lat],
      },
      password: hashPass,
    });
    req.session.currentUser = newUser;
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
