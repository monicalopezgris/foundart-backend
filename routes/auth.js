const express = require('express');
const createError = require('http-errors');

const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middelwares');

router.get('/me',
  isLoggedIn(),
  (req, res, next) => {
    console.log('session', req.session);
    res.json(req.session.currentUser);
  });

router.post(
  '/login',
  // isNotLoggedIn(),
  // validationLoggin(),
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        next(createError(404));
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        return res.status(200).json(user);
      } else {
        next(createError(401));
      }
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/signup',
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(422).json(errors.array());
    // }

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
      const salt = bcrypt.genSaltSync(10);
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
  },
);

router.post('/logout', isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  return res.status(204).send();
});

router.get('/private', isLoggedIn(), (req, res, next) => {
  res.status(200).json({
    message: 'This is a private message',
  });
});

module.exports = router;