const express = require('express');
const Article = require('../models/article');

const router = express.Router();

/* POST new article */
router.post('/', async (req, res, next) => {
  const {
    title, price, category, type, description, state,
  } = req.body;

  // Set currrentUser as leessee
  const userID = '5cf3e1b98a36e228ca1242f8';
  const lesseeID = userID;
  try {
    const article = await Article.create({
      title, price, category, lesseeID, userID, type, description, state,
    });
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
