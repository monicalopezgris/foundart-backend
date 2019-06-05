const { query, check, validationResult } = require('express-validator/check');

module.exports = {
  validationResult,
  signUpValidator: [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Insert your name'),
    check('lastName')
      .isLength({ min: 1 })
      .withMessage('Insert your last name'),
    check('username')
      .isLength({ min: 4 })
      .withMessage('Username must be 4 digits long'),
    check('telephone')
      .isLength({ min: 9, max: 9 })
      .withMessage('Insert a valid number'),
    check('email')
      .isEmail()
      .withMessage('Insert a valid email'),
    check('password')
      .isString()
      .withMessage('Insert a valid password'),
  ],
  logInValidator: [
    check('username')
      .isLength({ min: 4 })
      .withMessage('Username must be 4 digits long'),
    check('password')
      .isString()
      .withMessage('Insert a valid password'),
  ],
};
