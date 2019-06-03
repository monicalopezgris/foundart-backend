const { check, validationResult } = require('express-validator/check');

module.exports = {
  handleValidatorRes: (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    }
    next();
  },
  nearValidator: [
    check('distance')
      .isLength({ min: 1 })
      .withMessage('Insert a distance')
      .isNumeric()
      .withMessage('Insert a numeric data'),
    check('long')
      .isLength({ min: 1 })
      .withMessage('Insert a longitude')
      .isNumeric()
      .withMessage('Insert a numeric longitude'),
    check('lat')
      .isLength({ min: 1 })
      .withMessage('Insert a latitude')
      .isNumeric()
      .withMessage('Insert a numeric latitude'),
  ],
  newUpdateArticleValidator: [
    check('title')
      .isLength({ min: 3 })
      .withMessage('Article must have more than 3 characters')
      .isNumeric()
      .withMessage('Article title must be AlfhaNumeric'),
    check('category')
      .isString()
      .withMessage('Must be a string'),
    check('style')
      .isString()
      .withMessage('Must be a string'),
    check('price')
      .isNumeric()
      .withMessage('Must be a number'),
    check('description')
      .isString()
      .withMessage('Must be a string'),
    check('status')
      .isString()
      .withMessage('Must be a string'),
  ],
};
