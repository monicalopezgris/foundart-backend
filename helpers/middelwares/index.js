const createError = require('http-errors');

exports.isLoggedIn = () => (req, res, next) => {
  console.log('isLoggedin?');
  if (req.session.currentUser) {
    console.log('next');
    next();
  } else {
    next(createError(401));
  }
  console.log('NOT LOGGGED');
};

exports.isNotLoggedIn = () => (req, res, next) => {
  console.log('notLoggedIn??')
  if (!req.session.currentUser) {
    console.log('Not logged')
    next();
  } else {
    console.log('Logged')
    next(createError(403));
  }
};

exports.validationLoggin = () => (req, res, next) => {
  const { username, password } = req.body;
  console.log(username)
  if (!username || !password) {
    next(createError(422));
  } else {
    next();
  }
}
