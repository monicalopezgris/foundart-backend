const express = require('express');
const Article = require('../models/article');
const User = require('../models/user');

const router = express.Router();


const {
  isLoggedIn,
} = require('../helpers/middelwares');

// FAVORITE

router.get('/', isLoggedIn(), async (req, res, next) => {
  const { _id: userID } = req.session.currentUser;
  try {
    const user = await User.findById(userID).populate('favorite.articleID');
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

router.put('/',
  isLoggedIn(),
  async (req, res, next) => {
    try {
      const { _id: userID } = req.session.currentUser;
      const { articleID } = req.body;
      const fav = await User.findOne(
        { _id: userID, favorite: articleID },
      );
      if (!fav) {
        const user = await User.findOneAndUpdate({ _id: userID }, {
          $push: { favorite: articleID },
        });
        res.status(200).json(user);
      } else {
        res.status(422).json({ message: 'The article is already favorite' });
      }
    } catch (error) {
      next(error);
    }
  });

// GET single article favorite
// check
router.get('/:id', isLoggedIn(), async (req, res, next) => {
  const { id } = req.params;
  const userID = req.session.currentUser;
  const favorite = { articleID: id };
  try {
    const fav = await User.find(
      {
        _id: userID,
        favorites: { $elemMatch: { favorite } },
      },
    );
    if (!fav) {
      const article = await Article.findById(id).populate('userID');
      res.status(200).json(article);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
