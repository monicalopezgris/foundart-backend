const express = require('express');
const { validationResult, nearValidator, newUpdateArticleValidator, idValidator } = require('../helpers/validators/article');
const Article = require('../models/article');
const User = require('../models/user');
const uploadCloud = require('../config/cloudinary.js');
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

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
});

/* POST new article */
router.post('/', newUpdateArticleValidator, uploadCloud.single('image'), async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const {
    title, price, category, image, type, description, state,
  } = req.body;

  // Set img url and name
  const imgPath = req.file.url;
  // Set currrentUser as leessee
  const userID = '5cf3e1b98a36e228ca1242f8';
  const lesseeID = userID;

  try {
    const article = await Article.create({
      title, price, category, imgPath, lesseeID, userID, type, description, state,
    });
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const { id } = req.params;
  const {
    title, price, category, type, description, state,
  } = req.body;

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  const { id } = req.params;
  try {
    const article = await Article.findByIdAndDelete(id);
    res.status(200).json(article);
  } catch (error) {
    console.log(error);
  }
});

// FAVORITE

router.get('/favorites', async (req, res, next) => {
  const { _id: userID } = req.session.currentUser;
  try {
    const user = await User.findById(userID).populate('favorite.articleID');
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

router.put('/favorites', async (req, res, next) => {
  const { _id: userID } = req.session.currentUser;
  const { articleId } = req.body;
  const favorite = { articleID: articleId };
  try {
    const fav = await User.find(
      //idUser &&
      { favorites: { $elemMatch: { favorite } } },
    );
    if (!fav) {
      const user = await User.findOneAndUpdate({ _id: userID }, {
        $push: { favorite },
      });
      res.status(200).json(user);
    }
    res.status(422).json({ message: 'The article is already favorite' });
  } catch (error) {
    next(error);
  }
});

// GET single article favorite
router.get('/favorites/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const fav = await Article.findById(id).populate('userID');
    res.status(200).json(fav);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
