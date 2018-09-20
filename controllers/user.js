const passport = require('../config/passport');
const { User } = require('../db/schema');
const { errorHandler } = require('../db/errors');
const bcrypt = require('bcrypt');

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = async (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({'errors': errors});
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return handleResponse(res, 400, {'error': err})}
    if (user) {
      handleResponse(res, 200, user.getUser());
    }
  })(req, res, next);
};


/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = async (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({'errors': errors});
  }

  try {
    const user = await User.query()
                           .allowInsert('[username, password]')
                           .insert({
                             username: req.body.email,
                             password: req.body.password
                           });
  } catch (err) {
    errorHandler(err, res);
    return;
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) {  return handleResponse(res, 400, {'error': err})}
    if (user) {
      handleResponse(res, 200, user.getUser());
    }
  })(req, res, next);
};

exports.getWebhook = async (req, res, next) => {
  passport.authenticate('bearer', (err, user, info) => {
    if (err) { return handleResponse(res, 401, {'error': err}); }
    if (user) {
      handleResponse(res, 200, user.getWebhookRes());
    } else {
      handleResponse(res, 200, {'X-Hasura-Role': 'anonymous'});
    }
  })(req, res, next);
}


function handleResponse(res, code, statusMsg) {
  res.status(code).json(statusMsg);
}
