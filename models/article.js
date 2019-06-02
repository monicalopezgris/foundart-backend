const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const articleSchema = new Schema({
  title: String,
  category: String,
  type: String,
  description: String,
  price: Number,
  userID: {
    type: ObjectId,
    ref: 'User',
  },
  rent: [{
    lesseeID: {
      type: ObjectId,
      ref: 'User',
    },
    dateStart: Date,
    dateEnd: Date,
    totalPrice: Number,
    state: String,
  }],
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
