const express = require('express');
const moment = require('moment');
const {
  validationResult, nearValidator, newUpdateArticleValidator, idValidator
} = require('../helpers/validators/article');
const Article = require('../models/article');
const User = require('../models/user');
const uploadCloud = require('../config/cloudinary');
const multipart = require('connect-multiparty');

const router = express.Router();
const Datastore = require('nedb');
const Pusher = require('pusher');
const cloudinary = require('cloudinary');


const db = new Datastore();
const multipartMiddleware = multipart();
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  encrypted: true,
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// const cloudinary = require('cloudinary');

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require('../helpers/middelwares');

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

router.post('/', newUpdateArticleValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }

  try {
    const { values } = req.body;
    const { _id: id } = req.session.currentUser;
    const {
      title, price, category, type, description, state, image,
    } = values;
    const imgPath = image;
    const userID = id;

    const article = await Article.create({
      title,
      price,
      category,
      imgPath,
      lesseeID,
      userID,
      type,
      description,
      state,
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
router.put('/:id', isLoggedIn(), newUpdateArticleValidator, async (req, res, next) => {
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
router.delete('/:id', isLoggedIn(), idValidator, async (req, res, next) => {
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

// Creates a rent request for the article
router.post('/request', isLoggedIn(), async (req, res, next) => {
  const {
    dateStart, dateEnd, articleId, articlePrice,
  } = req.body;
  const userID = req.session.currentUser;
  const ds = moment(dateStart);
  const de = moment(dateEnd);
  const totalPrice = (de.diff(ds, 'days')) * articlePrice;
  const rent = {
    lesseeID: userID,
    dateStart,
    dateEnd,
    state: 'In progress',
    totalPrice,
  };
  const request = await Article.findOneAndUpdate({ _id: articleId }, {
    $push: { rent },
  });
  res.status(200).json(request);
});

module.exports = router;
