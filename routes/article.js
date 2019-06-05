const express = require('express');
const { nearValidator, handleValidatorRes, newUpdateArticleValidator, idValidator } = require('../helpers/validators/article');
const Article = require('../models/article');
const User = require('../models/user');

const router = express.Router();

/* GET articles */

router.get('/', async (req, res, next) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.log(error);
  }
});

/* GET articles by location */

router.get('/near', nearValidator, async (req, res, next) => {
  if (!handleValidatorRes(req, res)) {
    try {
      const usersId = [];
      const {
        distance,
        lat,
        long,
      } = req.body;

      const users = await User.find({
        loc: {
          $geoWithin: {
            $centerSphere: [
              [long, lat], distance / 6378.1,
            ],
          },
        },
      });

      await users.forEach((user) => {
        const { _id: id } = user;
        usersId.push(id);
      });

      const articlesNear = await Article.find({
        $and: [{
          userID: {
            $in: usersId,
          },
        }],
      }).populate('userID');
      res.status(200).json(articlesNear);
    } catch (error) {
      res.status(500).json({ error });
      console.log(error);
    }
  }
});

/* POST new article */
router.post('/', newUpdateArticleValidator, async (req, res, next) => {
  if (!handleValidatorRes(req, res)) {
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
  }
});

/* GET article */
router.get('/:id', idValidator, async (req, res, next) => {
  const { id } = req.params;
  try {
    const article = await Article.findById(id);
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
  }
});

/* UPDATE article */
router.put('/:id', newUpdateArticleValidator, async (req, res, next) => {
  const { id } = req.params;
  const {
    title, price, category, type, description, state,
  } = req.body;
  handleValidatorRes(req, res, next);
  try {
    const article = await Article.findByIdAndUpdate(id, {
      title, price, category, type, description,
    });
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
  }
});

/* DELETE article */
router.delete('/:id', idValidator, async (req, res, next) => {
  if (!handleValidatorRes(req, res, next)) {
    const { id } = req.query;
    console.log(req.query)
    try {
      const article = await Article.findByIdAndDelete(id);
      res.status(200).json(article);
    } catch (error) {
      console.log(error);
    }
  }
});
module.exports = router;
