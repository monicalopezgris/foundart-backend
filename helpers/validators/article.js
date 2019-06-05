const { query, check, validationResult } = require('express-validator/check');

module.exports = {
  validationResult,
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
      .isString()
      .withMessage('Article title must be AlfhaNumeric'),
    check('category')
      .isString()
      .withMessage('Must be a string'),
    check('type')
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
  idValidator: [
    check('id')
      .isString()
      .withMessage('Must be a valid Id'),
  ],
};
