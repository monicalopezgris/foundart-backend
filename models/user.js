const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  name: String,
  lastName: String,
  username: String,
  telephone: Number,
  email: String,
  password: String,
  favorite: [{
    articleID: {
      type: ObjectId,
      ref: 'Article',
    },
  }],
  loc: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  nationalId: {
    number: String,
    img: String,
  },
}, {
    timestamps: true,
  });

userSchema.index({ loc: '2dsphere' });
const User = mongoose.model('User', userSchema);

module.exports = User;
