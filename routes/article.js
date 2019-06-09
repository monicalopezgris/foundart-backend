const express = require('express');
const { validationResult, nearValidator, newUpdateArticleValidator, idValidator } = require('../helpers/validators/article');
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

//const cloudinary = require('cloudinary');


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

router.post('/', newUpdateArticleValidator, async(req, res, next) => {
  try {

  const errors = validationResult(req);
  const {values} = req.body;
  console.log(values)
  //console.log(req.body)
  const {
    title, price, category, type, description, state, image,
  } = values;
  console.log('ok',title, category, image)
  /* if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  } */

 /*  const {
    title, price, category, image, type, description, state,
  } = values; */

  // Set img url and name
  //const imgPath = image;
  const imgPath = image;
  console.log('url img',imgPath)
  // Set currrentUser as leessee
  const userID = '5cf3e1b98a36e228ca1242f8';
  const lesseeID = userID;

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
module.exports = router;
